export interface IComment {
  id: number;
  comment: string;
  author: string;
}

export interface IPostResponse {
  [key: string]: any,
  data: IPost[]
}

export interface IPost {
  id: number;
  title: string;
  author: string;
  photo: string | null;
  likes: number;
  created_at: Date;
  isLiked: boolean;
  postOwner: boolean;
  comments: IComment[];
}
