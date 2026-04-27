export type Page = "home" | "auth" | "feed" | "profile" | "my-posts";

export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  description: string;
  owner: string;
  cover: string;
  spine: string;
}