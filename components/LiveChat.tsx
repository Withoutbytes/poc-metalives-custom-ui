import { useCallback, useEffect, useRef, useState } from "react";
import {
	getFirestore,
	collection,
	query,
	limit,
	onSnapshot,
	orderBy,
	getDocs,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import { useList } from "react-use";

interface Props {
	liveId: number;
}

interface IChatMessage {
	id: string;
	text: string;
	name: string;
}

const LiveChat: React.FC<Props> = ({ liveId }) => {
	const [chatMessages, chatMessageControl] = useList<IChatMessage>([]);
	const refName = useRef<HTMLInputElement>(null);
	const refMessage = useRef<HTMLInputElement>(null);

	const sendMessage = async (liveId: number, text: string, name: string) => {
		const db = getFirestore();

		addDoc(collection(db, "live-" + liveId, "chat", "messages"), {
			name: name,
			text: text,
			createdAt: serverTimestamp(),
		});
	};

	const onClickSendMessage = () => {
		const text = refMessage.current?.value;
		const name = refName.current?.value;

		if (text && name) {
			sendMessage(liveId, text, name);
			refMessage.current.value = "";
		}
	};

	const getAllMessages = async (liveId: number) => {
		const db = getFirestore();

		const q = query(
			collection(db, "live-" + liveId, "chat", "messages"),
			orderBy("createdAt", "desc"),
			limit(50)
		);
		const documentSnapshots = await getDocs(q);

		return documentSnapshots.docs
			.map((doc) => {
				return { id: doc.id, text: doc.data().text, name: doc.data().name };
			})
			.reverse();
	};

	const listenForMessages = useCallback(
		async (
			liveId: number,
			newMessageCb: (messages: { id: string; text: string; name: string }[]) => void
		) => {
			const db = getFirestore();

			const q2 = query(
				collection(db, "live-" + liveId, "chat", "messages"),
				orderBy("createdAt", "desc"),
				limit(50)
			);
			const unsubscribeMessages = onSnapshot(q2, { includeMetadataChanges: false }, (querySnapshot) => {
				if (!querySnapshot.metadata.fromCache) {
					const messages = querySnapshot.docs
						.map((doc) => {
							return { id: doc.id, text: doc.data().text, name: doc.data().name };
						})
						.reverse();

					newMessageCb(messages);
				}
			});

			return () => unsubscribeMessages();
		},
		[]
	);

	useEffect(() => {
		// getAllMessages(liveId).then((messages) => {
		// 	chatMessageControl.set(messages);
		// });
		listenForMessages(liveId, (messages) => {
			chatMessageControl.set(messages);
		});
	}, [liveId, chatMessageControl, listenForMessages]);

	return (
		<div>
			<span className="overflow-y-hidden max-h-[1px] bg-black bg-opacity-50">
				{chatMessages.map((message) => (
					<div key={message.id}>
						<span>{message.name}: </span>
						<span>{message.text}</span>
					</div>
				))}
			</span>

			<div className="flex my-3">
				<label className="h-full px-2 py-1 text-white bg-emerald-600 rounded-l-md">Name: </label>
				<input ref={refName} type="text" className="px-2 py-1 text-white bg-emerald-600 rounded-r-md" />
			</div>

			<div>
				<input ref={refMessage} type="text" className="px-2 py-1 text-black rounded-l-md" />
				<button
					className="px-2 py-1 text-white bg-blue-700 rounded-r-md"
					onClick={() => onClickSendMessage()}
				>
					Enviar
				</button>
			</div>
		</div>
	);
};

export default LiveChat;
