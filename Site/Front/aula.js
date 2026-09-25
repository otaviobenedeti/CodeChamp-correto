const API_URL = "http://localhost:3000";

let lessons = [];
let activeFilter = "all";
let activeLesson = null;

const categoryMeta = {
    javascript: {
        catLabel: "⚡ JavaScript",
        catClass: "cat-js",
        dotColor: "#FFD700"
    },
    frontend: {
        catLabel: "🖥️ Frontend",
        catClass: "cat-front",
        dotColor: "#4B8CFF"
    },
    backend: {
        catLabel: "🔧 Backend",
        catClass: "cat-back",
        dotColor: "#3DFF7A"
    },
    cpp: {
        catLabel: "⚙️ C++",
        catClass: "cat-cpp",
        dotColor: "#FF3B6B"
    },
    python: {
        catLabel: "🐍 Python",
        catClass: "cat-python",
        dotColor: "#56B4D3"
    }
};

function extractYouTubeId(url) {
    if (!url) return null;

    const patterns = [
        /youtube\.com\/watch\?v=([\w-]{11})/,
        /youtu\.be\/([\w-]{11})/,
        /youtube\.com\/embed\/([\w-]{11})/,
        /youtube\.com\/shorts\/([\w-]{11})/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);

        if (match) {
            return match[1];
        }
    }

    return null;
}

async function carregarAulas() {
    try {
        const resposta = await fetch(`${API_URL}/lesson/listar`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar aulas");
        }

        lessons = await resposta.json();

        console.log("Aulas carregadas:", lessons);

        renderPlaylist();

        if (lessons.length > 0) {
            if (!activeLesson) {
                activeLesson = lessons[0].id;
            }

            loadLesson(activeLesson);
        }
    } catch (err) {
        console.error("Erro ao carregar aulas:", err);

        const lista = document.getElementById("lessonList");

        if (lista) {
            lista.innerHTML = `
                <div style="
                    padding:20px;
                    color:#ff3b6b;
                    text-align:center;
                ">
                    ❌ Não foi possível carregar as aulas.
                    <br><br>
                    Verifique se o backend está rodando.
                </div>
            `;
        }
    }
}

function renderPlaylist() {
    const list = document.getElementById("lessonList");

    if (!list) return;

    list.innerHTML = "";

    const filtered = getFiltered();

    const count = document.getElementById("lessonCount");

    if (count) {
        count.textContent = filtered.length;
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div style="
                padding:30px;
                text-align:center;
                color:#aaa;
            ">
                Nenhuma aula encontrada.
            </div>
        `;

        return;
    }

    filtered.forEach((lesson, index) => {
        const category =
            lesson.language?.toLowerCase() || "javascript";

        const meta =
            categoryMeta[category] || {
                catLabel: category,
                catClass: "cat-js",
                dotColor: "#FFD700"
            };

        const youtubeId =
            extractYouTubeId(lesson.youtubeUrl);

        const div = document.createElement("div");

        div.className =
            "lesson-item" +
            (lesson.id === activeLesson ? " active" : "");

        div.onclick = () => {
            loadLesson(lesson.id);
        };

        div.innerHTML = `
            <div class="lesson-thumb">

                ${youtubeId
                ? `
                            <img
                                src="https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg"
                                style="
                                    width:100%;
                                    height:100%;
                                    object-fit:cover;
                                "
                            >
                        `
                : ""
            }

                <div class="play-overlay">
                    ${lesson.id === activeLesson
                ? "▶"
                : "▷"
            }
                </div>

                <div class="lesson-num">
                    ${index + 1}
                </div>

            </div>

            <div class="lesson-info">

                <div class="lesson-name">
                    ${lesson.title || "Sem título"}
                </div>

                <div class="lesson-meta">

                    <div
                        class="lesson-cat-dot"
                        style="background:${meta.dotColor}"
                    ></div>

                    <span class="lesson-dur">
                        ${lesson.difficulty || "Aula"}
                    </span>

                    <span class="lesson-dur">
                        ${meta.catLabel}
                    </span>

                </div>

            </div>
        `;

        list.appendChild(div);
    });
}

function loadLesson(id) {
    const lesson =
        lessons.find(item => item.id === id);

    if (!lesson) return;

    console.log("Aula selecionada:", lesson);
    console.log("Descrição recebida:", lesson.description);

    activeLesson = id;

    const youtubeId =
        extractYouTubeId(lesson.youtubeUrl);

    const video =
        document.getElementById("mainVideo");

    if (youtubeId) {
        video.src =
            `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    } else {
        video.src = "";
    }

    const videoTitle =
        document.getElementById("videoTitle");

    if (videoTitle) {
        videoTitle.textContent =
            lesson.title || "Sem título";
    }

    const videoDescription =
        document.getElementById("videoDescription");

    if (videoDescription) {
        videoDescription.textContent =
            lesson.description ||
            "Sem descrição disponível.";
    }

    const category =
        lesson.language?.toLowerCase() ||
        "javascript";

    const meta =
        categoryMeta[category] ||
        categoryMeta.javascript;

    const videoCat =
        document.getElementById("videoCat");

    if (videoCat) {
        videoCat.textContent =
            meta.catLabel;

        videoCat.className =
            "video-category " +
            meta.catClass;
    }

    const ytLink =
        document.getElementById("ytLink");

    if (ytLink) {
        ytLink.href =
            lesson.youtubeUrl || "#";
    }

    renderPlaylist();
}

function setFilter(filter, element) {
    activeFilter = filter;

    document
        .querySelectorAll(".tag")
        .forEach(tag => {
            tag.classList.remove("active");
        });

    if (element) {
        element.classList.add("active");
    }

    renderPlaylist();
}

function getFiltered() {
    const input =
        document.getElementById("searchInput");

    const search =
        input
            ? input.value.toLowerCase().trim()
            : "";

    return lessons.filter(lesson => {
        const language =
            lesson.language?.toLowerCase() || "";

        const title =
            lesson.title?.toLowerCase() || "";

        const description =
            lesson.description?.toLowerCase() || "";

        const matchFilter =
            activeFilter === "all" ||
            language === activeFilter;

        const matchSearch =
            !search ||
            title.includes(search) ||
            language.includes(search) ||
            description.includes(search);

        return matchFilter && matchSearch;
    });
}

function filterLessons() {
    renderPlaylist();
}

function openAddModal() {
    const modal =
        document.getElementById("addModal");

    if (!modal) return;

    modal.classList.add("open");

    const errorEl =
        document.getElementById("modalError");

    if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.remove("show");
    }
}

function closeAddModal() {
    const modal =
        document.getElementById("addModal");

    if (modal) {
        modal.classList.remove("open");
    }

    const name =
        document.getElementById("newVideoName");

    const description =
        document.getElementById("newVideoDescription");

    const url =
        document.getElementById("newVideoUrl");

    const language =
        document.getElementById("newVideoLang");

    if (name) {
        name.value = "";
    }

    if (description) {
        description.value = "";
    }

    if (url) {
        url.value = "";
    }

    if (language) {
        language.selectedIndex = 0;
    }

    const errorEl =
        document.getElementById("modalError");

    if (errorEl) {
        errorEl.textContent = "";
        errorEl.classList.remove("show");
    }
}

async function submitNewVideo() {
    const name =
        document
            .getElementById("newVideoName")
            .value
            .trim();

    const description =
        document
            .getElementById("newVideoDescription")
            .value
            .trim();

    const url =
        document
            .getElementById("newVideoUrl")
            .value
            .trim();

    const language =
        document
            .getElementById("newVideoLang")
            .value;

    const errorEl =
        document.getElementById("modalError");

    const youtubeId =
        extractYouTubeId(url);

    if (!name) {
        errorEl.textContent =
            "Digite o nome da aula.";

        errorEl.classList.add("show");

        return;
    }

    if (!description) {
        errorEl.textContent =
            "Digite uma descrição para a aula.";

        errorEl.classList.add("show");

        return;
    }

    if (!youtubeId) {
        errorEl.textContent =
            "Digite um link válido do YouTube.";

        errorEl.classList.add("show");

        return;
    }

    errorEl.classList.remove("show");

    try {
        const resposta =
            await fetch(
                `${API_URL}/lesson/cadastrar`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        title: name,
                        language: language,
                        description: description,
                        youtubeUrl: url,
                        status: "PUBLISHED",
                        order: lessons.length
                    })
                }
            );

        const data =
            await resposta.json();

        console.log(
            "Resposta do servidor:",
            data
        );

        if (!resposta.ok) {
            throw new Error(
                data.erro ||
                data.error ||
                "Erro ao cadastrar aula"
            );
        }

        lessons.push(data);

        activeLesson = data.id;

        closeAddModal();

        renderPlaylist();

        loadLesson(data.id);

        showToast(
            "✅ Aula cadastrada com sucesso!"
        );

    } catch (err) {
        console.error(
            "Erro ao cadastrar aula:",
            err
        );

        errorEl.textContent =
            err.message ||
            "Erro ao cadastrar aula no servidor.";

        errorEl.classList.add("show");
    }
}

function showToast(message) {
    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

async function excluirAula() {
    console.log("Botão excluir clicado");

    if (!activeLesson) {
        showToast(
            "❌ Nenhuma aula selecionada."
        );

        return;
    }

    const lesson =
        lessons.find(
            item => item.id === activeLesson
        );

    if (!lesson) {
        showToast(
            "❌ Aula não encontrada."
        );

        return;
    }

    const confirmar =
        confirm(
            `Deseja realmente excluir a aula "${lesson.title}"?`
        );

    if (!confirmar) {
        return;
    }

    try {
        console.log(
            "Excluindo aula:",
            lesson.id
        );

        const resposta =
            await fetch(
                `${API_URL}/lesson/excluir/${lesson.id}`,
                {
                    method: "DELETE"
                }
            );

        const data =
            await resposta.json();

        console.log(
            "Resposta da exclusão:",
            data
        );

        if (!resposta.ok) {
            throw new Error(
                data.erro ||
                "Erro ao excluir aula"
            );
        }

        lessons =
            lessons.filter(
                item =>
                    item.id !== lesson.id
            );

        if (lessons.length > 0) {
            activeLesson =
                lessons[0].id;

            renderPlaylist();

            loadLesson(
                activeLesson
            );

        } else {
            activeLesson = null;

            renderPlaylist();

            const video =
                document.getElementById(
                    "mainVideo"
                );

            if (video) {
                video.src = "";
            }

            const title =
                document.getElementById(
                    "videoTitle"
                );

            if (title) {
                title.textContent =
                    "Nenhuma aula selecionada";
            }

            const description =
                document.getElementById(
                    "videoDescription"
                );

            if (description) {
                description.textContent = "";
            }

            const category =
                document.getElementById(
                    "videoCat"
                );

            if (category) {
                category.textContent = "";
            }

            const ytLink =
                document.getElementById(
                    "ytLink"
                );

            if (ytLink) {
                ytLink.href = "#";
            }
        }

        showToast(
            "🗑️ Aula excluída com sucesso!"
        );

    } catch (error) {
        console.error(
            "Erro ao excluir:",
            error
        );

        showToast(
            "❌ Erro ao excluir aula."
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarAulas();

        const modal =
            document.getElementById(
                "addModal"
            );

        if (modal) {
            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target.id ===
                        "addModal"
                    ) {
                        closeAddModal();
                    }

                }
            );
        }

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {
                    closeAddModal();
                }

            }
        );
    }
);