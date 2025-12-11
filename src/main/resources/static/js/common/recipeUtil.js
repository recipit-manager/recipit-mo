import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";
import { uiUtil } from "/js/common/uiUtil.js";

export const recipeUtil = {
    initLikeButton() {
        const $container =
            document.querySelector(".recipe-scroll-area") ||
            document.querySelector(".recipe-detail-container") ||
            document.querySelector(".popular-section");

        $container.addEventListener("click", async (e) => {

            const likeBtn = e.target.closest(".like-button-area");
            if (!likeBtn) {
                return;
            }

            e.stopPropagation();
            e.stopImmediatePropagation();

            const $card = likeBtn.closest(".recipe-card");
            const recipeId = $card.dataset.id;

            const $iconLiked = likeBtn.querySelector(".icon-liked");
            const $iconUnliked = likeBtn.querySelector(".icon-unliked");
            const $count = likeBtn.querySelector(".like-count");

            const isLogin = document.body.dataset.isLogin === "true";
            const isLiked = !$iconLiked.classList.contains("hidden");

            if (!isLogin) {
                window.location.href = "/user/login";
                return;
            }

            if ($card.dataset.processing === "Y") {
                return;
            }

            $card.dataset.processing = "Y";

            try {
                const apiCall = isLiked
                    ? apiUtil.delete(apiUtil.url.RECIPE.LIKE(recipeId))
                    : apiUtil.post(apiUtil.url.RECIPE.LIKE(recipeId));

                const data = await apiCall;

                if (data.code !== responseCode.SUCCESS) {
                    console.error(log.LIKE_RECIPE_FAILED, data.message);
                    return;
                }

                if (isLiked) {
                    $iconLiked.classList.add("hidden");
                    $iconUnliked.classList.remove("hidden");
                    $count.textContent = +$count.textContent - 1;
                } else {
                    $iconUnliked.classList.add("hidden");
                    $iconLiked.classList.remove("hidden");
                    $count.textContent = +$count.textContent + 1;
                }

            } catch (e) {
                console.error(log.LIKE_RECIPE_FAILED, e);
            } finally {
                $card.dataset.processing = "N";
            }

        });
    },

    initRecipeClick() {
        const $container = document.querySelector(".recipe-scroll-area");

        $container.addEventListener("click", (e) => {

            if (e.target.closest(".like-button-area") ||
                e.target.closest(".bookmark-icon")) {
                return;
            }

            const card = e.target.closest(".recipe-card");
            if (!card) {
                return;
            }

            location.href = `/home/recipe/${card.dataset.id}`;
        });
    },

    initWriteButton() {
        const $writeButton = document.getElementById("writeRecipeBtn");

        $writeButton.addEventListener("click", async () => {
            try {
                const data = await apiUtil.get(apiUtil.url.RECIPE.DRAFT_COUNT);

                if (data.code === responseCode.SUCCESS) {
                    if (data.data >= 10) {
                        uiUtil.showDraftLimitModal();
                        return;
                    }

                    window.location.href = "/home/recipe/upload";
                } else {
                    console.error(log.DRAFT_COUNT_FAILED, data.message);
                }
            } catch (e) {
                console.error(log.DRAFT_COUNT_FAILED, e);
            }
        });
    },

    initScrollTopButton() {
        const $btn = document.getElementById("scrollTopBtn");
        const $area = document.querySelector(".recipe-scroll-area");

        $area.addEventListener("scroll", () => {
            if ($area.scrollTop > 200) {
                $btn.classList.add("show");
            } else {
                $btn.classList.remove("show");
            }
        });

        $btn.addEventListener("click", () => {
            $area.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    },

    buildParams(update = {}, remove = []) {
        const current = new URLSearchParams(location.search);
        const params = new URLSearchParams(current.toString());

        Object.entries(update).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        remove.forEach(key => params.delete(key));

        return params;
    },

    initBookmarkButton() {
        document.querySelectorAll(".bookmark-icon").forEach($icon => {
            let isProcessing = false;

            const recipeId = $icon.dataset.id;
            const isLogin = document.body.dataset.isLogin === "true";

            async function toggleBookmark(isBookmarked) {
                if (isProcessing) {
                    return;
                }
                isProcessing = true;

                if (!isLogin) {
                    window.location.href = "/user/login";
                    return;
                }

                const apiCall = isBookmarked
                    ? apiUtil.delete(apiUtil.url.RECIPE.BOOKMARK(recipeId))
                    : apiUtil.post(apiUtil.url.RECIPE.BOOKMARK(recipeId), {});

                try {
                    const data = await apiCall;

                    if (data.code !== responseCode.SUCCESS) {
                        console.error(log.BOOKMARK_RECIPE_FAILED, data.message);
                        return;
                    }

                    if (isBookmarked) {
                        $icon.src = "/images/unBookmark.png";
                        $icon.dataset.bookmarked = "N";
                    } else {
                        $icon.src = "/images/bookmark.png";
                        $icon.dataset.bookmarked = "Y";
                    }

                } catch (e) {
                    console.error(log.BOOKMARK_RECIPE_FAILED, e);

                } finally {
                    isProcessing = false;
                }
            }

            $icon.addEventListener("click", e => {
                e.stopPropagation();

                const isBookmarked = ($icon.dataset.bookmarked || "N").toUpperCase() === "Y";

                toggleBookmark(isBookmarked);
            });
        });
    }
};
