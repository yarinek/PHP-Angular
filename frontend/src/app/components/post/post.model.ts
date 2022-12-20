export interface IComment {
  id: number;
  comment: string;
  author: string;
}

export interface IPost {
  id: number;
  title: string;
  author: string;
  photo: string | null;
  likes: number;
  created_at: Date;
  isLiked: boolean;
  comments: IComment[];
}
