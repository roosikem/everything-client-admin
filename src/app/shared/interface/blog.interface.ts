import { PaginateModel } from "./core.interface";
import { Attachment } from "./attachment.interface";
import { Category } from "./category.interface";
import { Tag } from "./tag.interface";

export interface BlogModel extends PaginateModel {
    data: Blog[];
}

export interface AnswerModel {
    data: Answer[];
    total: number;
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    status: boolean;
    meta_title: string,
    meta_description: string,
    blog_thumbnail: Attachment;
    blog_thumbnail_id: number;
    blog_meta_image_id: number;
    blog_meta_image: Attachment;
    categories: Category[];
    tags: Tag[];
    is_featured: boolean;
    is_sticky: boolean;
    created_by_id: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface Answer {
    blog: Blog;
    answerId: number;
    answerP1: string;
    answerP2: string;
    answerP3: string;
    content: string;
    order: number;
    showType: number,
    codeLanguage: number,
    showAceLineNumber: number,
   
}