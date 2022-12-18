export interface IPost {
  id: number;
  title: string;
  author: string;
  photo: string | null;
  likes: number;
  created_at: Date;
}
