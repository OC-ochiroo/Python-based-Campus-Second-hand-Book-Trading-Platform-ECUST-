import type { Book } from "./types";

export const BOOKS: Book[] = [
  { id: 1, title: "The Pragmatic Programmer", author: "David Thomas", rating: 4.5, description: "...", owner: "alice_tw", cover: "#2c3e50", spine: "#1a252f" },
  { id: 2, title: "Atomic Habits", author: "James Clear", rating: 4.8, description: "...", owner: "bob_reads", cover: "#5c4a1e", spine: "#3d3014" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", rating: 4.6, description: "...", owner: "carol_uni", cover: "#3d2b1f", spine: "#2a1d14" },
  { id: 4, title: "Deep Work", author: "Cal Newport", rating: 4.4, description: "...", owner: "dave_lib", cover: "#1c3a2e", spine: "#122719" },
];

export const MY_BOOKS: Book[] = [
  { id: 5, title: "Clean Code", author: "Robert C. Martin", rating: 4.3, description: "A handbook of agile software craftsmanship. Write code that humans can read.", owner: "me", cover: "#4a2040", spine: "#321529" },
  { id: 6, title: "The Lean Startup", author: "Eric Ries", rating: 4.2, description: "How constant innovation creates radically successful businesses.", owner: "me", cover: "#1e3a5f", spine: "#132540" },
  { id: 7, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", rating: 4.7, description: "A lifetime of research on the two systems that drive the way we think.", owner: "me", cover: "#4a3c1a", spine: "#342a10" },
];