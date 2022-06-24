import axios from "axios";
import * as LiveByAliasType from "types/LiveByAliasType";

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}`,
});

export function getLivesByOrgName(orgName: string) {
	//return api.get(`/live`);
	return api.get(`/live/organization/${orgName}`).then((res) => res.data);
}

export function getLiveByAlias({ live, org }: { live: string; org: string }) {
	return api.get<LiveByAliasType.Root>(`/live/alias/${live}/org/${org}`).then((res) => res.data);
}
