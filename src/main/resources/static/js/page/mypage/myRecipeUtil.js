import { translate } from "/js/i18n/i18n.js";
import { apiUtil } from "/js/common/apiUtil.js";
import { responseCode, log } from "/js/common/constants.js";
import { uiUtil } from "/js/common/uiUtil.js";
import { recipeUtil } from "/js/common/recipeUtil.js";

export const myRecipeUtil = {

    initCardClick({
                      containerSelector = ".recipe-scroll-area",
                      ignoreSelectors = [],
                      onCardClick
                  }) {
        const $container = document.querySelector(containerSelector);
        if (!$container || !onCardClick) {
            return;
        }

        $container.addEventListener("click", (event) => {

            for (const selector of ignoreSelectors) {
                if (event.target.closest(selector)) {
                    return;
                }
            }

            const $card = event.target.closest(".recipe-card");
            if (!$card) {
                return;
            }

            onCardClick($card);
        });
    },

    initDeleteButton(containerSelector = ".recipe-scroll-area") {
        const $container = document.querySelector(containerSelector);
        if (!$container) {
            return;
        }

        $container.addEventListener("click", (event) => {
            const $deleteButton = event.target.closest(".recipe-delete-btn");
            if (!$deleteButton) {
                return;
            }

            event.stopPropagation();

            const recipeId = $deleteButton.dataset.id;

            uiUtil.showConfirmModal(
                translate("ui.recipe.delete.confirm"),
                {
                    title: translate("ui.recipe.delete.title"),
                    confirmText: translate("common.delete"),
                    cancelText: translate("common.cancel"),

                    onConfirm: async () => {
                        try {
                            const data = await apiUtil.delete(
                                apiUtil.url.RECIPE.DELETE(recipeId)
                            );

                            if (data.code !== responseCode.SUCCESS) {
                                console.error(log.RECIPE_DELETE_FAILED, data.message);
                                return;
                            }

                            location.reload();

                        } catch (error) {
                            console.error(log.RECIPE_DELETE_FAILED, error);
                        }
                    }
                }
            );
        });
    },

    initEmptyWriteButton() {
        const $btn = document.getElementById("emptyWriteRecipeBtn");
        if (!$btn) return;

        $btn.addEventListener("click", recipeUtil.handleWriteRecipe);
    },

    initInfiniteScroll({
                           containerSelector = ".recipe-scroll-area",
                           listSelector = "#recipeList",
                           apiUrl,
                           pageSize = 10,
                           buildCard,
                           afterAppend = null
                       }) {
        let currentPage = 1;
        let isLoading = false;
        let isLastPage = false;

        const $container = document.querySelector(containerSelector);
        const $list = document.querySelector(listSelector);
        if (!$container || !$list || !apiUrl || !buildCard) {
            return;
        }

        async function loadNextPage() {
            if (isLoading || isLastPage) {
                return;
            }

            isLoading = true;
            currentPage++;

            const params = new URLSearchParams();
            params.set("page", currentPage);
            params.set("size", pageSize);

            try {
                const data = await apiUtil.get(apiUrl, params);

                if (data.code !== responseCode.SUCCESS) {
                    console.error(log.FAILED_LOAD_NEXT_PAGE, data.message);
                    return;
                }

                const recipes = data.data;
                if (!recipes || recipes.length === 0) {
                    isLastPage = true;
                    return;
                }

                const fragment = document.createDocumentFragment();
                recipes.forEach(recipe => {
                    fragment.appendChild(buildCard(recipe));
                });

                $list.appendChild(fragment);

                if (afterAppend) {
                    afterAppend();
                }

            } catch (e) {
                console.error(log.FAILED_LOAD_NEXT_PAGE, e);
            } finally {
                isLoading = false;
            }
        }

        $container.addEventListener("scroll", () => {
            const isNearBottom =
                $container.scrollTop + $container.clientHeight >=
                $container.scrollHeight - 150;

            if (isNearBottom) {
                loadNextPage();
            }
        });
    },

    buildRecipeCard(recipe, {
        showDelete = false,
        showBookmark = false
    } = {}) {
        const $card = document.createElement("div");
        $card.className = "recipe-card";
        $card.dataset.id = recipe.recipeNo;

        const $imgBox = document.createElement("div");
        $imgBox.className = "recipe-img-box";

        const $img = document.createElement("img");
        $img.src = recipe.imageUrl;
        $img.alt = "recipe image";
        $imgBox.appendChild($img);

        const $info = document.createElement("div");
        $info.className = "recipe-info";

        const $name = document.createElement("p");
        $name.className = "recipe-name";
        $name.textContent = recipe.name;

        const $desc = document.createElement("p");
        $desc.className = "recipe-desc";
        $desc.textContent = recipe.description;

        const $meta = document.createElement("div");
        $meta.className = "recipe-meta";

        const $time = document.createElement("span");
        $time.className = "meta-item";
        $time.textContent = `${recipe.cookingTime}분`;

        const $difficulty = document.createElement("span");
        $difficulty.className = "meta-item";
        $difficulty.textContent = recipe.difficulty;

        const $like = document.createElement("div");
        $like.className = "recipe-like like-button-area";

        const $unliked = document.createElement("img");
        $unliked.src = "/images/unlike.png";
        $unliked.className = `icon-unliked ${recipe.isLiked ? "hidden" : ""}`;

        const $liked = document.createElement("img");
        $liked.src = "/images/like.png";
        $liked.className = `icon-liked ${recipe.isLiked ? "" : "hidden"}`;

        const $count = document.createElement("span");
        $count.className = "like-count";
        $count.textContent = recipe.likeCount;

        $like.append($unliked, $liked, $count);
        $meta.append($time, $difficulty, $like);

        $info.append($name, $desc, $meta);

        $card.append($imgBox, $info);

        if (showBookmark) {
            const $bookmark = document.createElement("img");
            $bookmark.className = "bookmark-icon";
            $bookmark.src = recipe.isBookmarked
                ? "/images/bookmark.png"
                : "/images/unBookmark.png";
            $bookmark.dataset.bookmarked = recipe.isBookmarked ? "Y" : "N";
            $bookmark.dataset.id = recipe.recipeNo;
            $card.appendChild($bookmark);
        }

        if (showDelete) {
            const $delete = document.createElement("div");
            $delete.className = "recipe-delete-btn";
            $delete.dataset.id = recipe.recipeNo;

            const $img = document.createElement("img");
            $img.src = "/images/delete.png";
            $delete.appendChild($img);

            $card.appendChild($delete);
        }

        return $card;
    }
};
