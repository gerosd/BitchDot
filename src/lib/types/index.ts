import { ObjectId } from 'mongodb';

export interface Product {
    _id?: string | ObjectId;
    title: string;
    description: string;
    specifications: Record<string, string>;
    image: string;
    images?: string[];
    price: number;
    discPrice?: number;
    categories: string[];
    subcategories?: string[];
    isBestseller: boolean;
    whereToBuy: { name: string; url: string }[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {
    _id?: string | ObjectId;
    name: string;
    subcategories: {
        id: string;
        name: string;
    }[];
}

export interface SiteSettings {
    _id?: string | ObjectId;
    heroBanner?: {
        imageUrl: string;
        title: string;
        subtitle: string;
        buttonText: string;
        buttonLink: string;
    };
    featuredVideo?: {
        videoUrl: string;
        thumbnailUrl: string;
        title: string;
    };
    whereToBuy?: {
        wildberriesUrl: string;
        ozonUrl: string;
    };
}

export interface Review {
    _id?: string | ObjectId;
    title: string;
    text?: string;
    videoUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AboutValue {
    title: string;
    description: string;
}

export interface AboutBrandData {
    _id?: string | ObjectId;
    heroImage: string;
    title: string;
    subtitle: string;
    philosophyText: string[];
    valuesTitle: string;
    values: AboutValue[];
}
