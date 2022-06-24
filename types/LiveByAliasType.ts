export interface Root {
	id: number;
	startsAt: any;
	streamKey: string;
	uriAlias: string;
	streamUrl: string;
	visibility: number;
	chatEnabled: boolean;
	status: number;
	title: string;
	description: string;
	thumbImg: string;
	createdAt: string;
	updatedAt: string;
	organizationId: number;
	products: Product[];
}

export interface Product {
	id: number;
	name: string;
	url: string;
	price: number;
	originalPrice: any;
	imageUrl: string;
	ref: any;
	createdAt: string;
	updatedAt: string;
	storeId: any;
}
