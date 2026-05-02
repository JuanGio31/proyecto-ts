import { defineStore } from "pinia";
import { ref } from "vue";
import {
  postsService,
  type Post,
  type ReactionType,
} from "../services/posts.services";

interface PostReactionsMap {
  [postId: number]: {
    likes: number;
    dislikes: number;
    myReaction: ReactionType | null;
  };
}

export const usePostsStore = defineStore("posts", () => {
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const reactions = ref<PostReactionsMap>({});

  async function fetchPosts() {
    loading.value = true;
    try {
      posts.value = await postsService.getPosts();
      await Promise.all(
        posts.value.map(async (post) => {
          const counts = await postsService.getReactions(post.id_post);
          const myReaction = await postsService.getMyReaction(post.id_post);
          reactions.value[post.id_post] = {
            likes: counts.likes,
            dislikes: counts.dislikes,
            myReaction: myReaction.reaction,
          };
        }),
      );
    } finally {
      loading.value = false;
    }
  }

  async function toggleLike(postId: number) {
    const result = await postsService.toggleReaction(postId, "like");
    const current = reactions.value[postId];
    const previous = current?.myReaction;

    if (previous === "like") {
      reactions.value[postId] = {
        likes: result.likes,
        dislikes: result.dislikes,
        myReaction: null,
      };
    } else {
      reactions.value[postId] = {
        likes: result.likes,
        dislikes: result.dislikes,
        myReaction: "like",
      };
    }
  }

  async function toggleDislike(postId: number) {
    const result = await postsService.toggleReaction(postId, "dislike");
    const current = reactions.value[postId];
    const previous = current?.myReaction;

    if (previous === "dislike") {
      reactions.value[postId] = {
        likes: result.likes,
        dislikes: result.dislikes,
        myReaction: null,
      };
    } else {
      reactions.value[postId] = {
        likes: result.likes,
        dislikes: result.dislikes,
        myReaction: "dislike",
      };
    }
  }

  function getReactions(postId: number) {
    return reactions.value[postId] || { likes: 0, dislikes: 0, myReaction: null };
  }

  return {
    posts,
    loading,
    fetchPosts,
    toggleLike,
    toggleDislike,
    getReactions,
  };
});