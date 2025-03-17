export interface Comment {
  author_avatar: string;
  author_nickname: string;
  id: number;
  parent_id: number;
  sub_comments: Comment[];
  task_id: number;
  text: string;
}
