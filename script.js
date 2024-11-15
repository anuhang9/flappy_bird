let display = document.querySelector(".container");
let pipe_div = document.querySelector(".pipes-nodes");
let score_number = document.querySelector(".score-number");
let high_score = parseInt(localStorage.getItem("highScore")) || 0;
let initial_score = 0;


// Random pipe node creation
function create_nodes() {
  let pipe_node = document.createElement("div");
  pipe_node.classList.add("pipe");
  if (Math.floor(Math.random() * 2) === 1) {
    pipe_node.style.top = 0;
    pipe_node.style.bottom = "";
  } else {
    pipe_node.style.bottom = 0;
    pipe_node.style.top = "";
  }
  pipe_div.appendChild(pipe_node);
}

// Pipe movement function
function run_pipe() {
  let display_over_view = display.getBoundingClientRect();
  let all_pipe = document.querySelectorAll(".pipe");

  all_pipe.forEach((current_pipe) => {
    let pipe_over_view = current_pipe.getBoundingClientRect();
    let every_pipe_transform = current_pipe.style.transform.match(/-?\d+/);
    let check_transform = every_pipe_transform
      ? parseInt(every_pipe_transform[0])
      : 0;
    let new_transform = check_transform - 4;
    current_pipe.style.transform = `translateX(${new_transform}px)`;

    if (pipe_over_view.right < display_over_view.left) {
      current_pipe.remove();
    }

    // Bird behavior and collision detection
    let bird = document.querySelector(".bird");
    if (bird) {
      let bird_over_view = bird.getBoundingClientRect();
      bird.style.transform = `translateY(${display_over_view.bottom}px)`;
      bird.style.transitionTimingFunction = "ease-out";
      bird.style.transitionDuration = "3s";

      // Score counting
      if (pipe_over_view.left < bird_over_view.left && !current_pipe.passed) {
        initial_score += 1;
        score_number.innerText = initial_score;
        current_pipe.passed = true;
      }

      // Game over function
      function game_over() {
        let game_over_div = document.createElement("div");
        game_over_div.classList.add("game-over-div");

        // Current score display
        let your_score = document.createElement("h2");
        your_score.innerText = `Your score: ${initial_score}`;
        game_over_div.appendChild(your_score);

        // Update high score if the current score is higher
        if (initial_score > high_score) {
          high_score = initial_score;
          localStorage.setItem("highScore", high_score);
        }

        // High score display
        let high_score_display = document.createElement("h3");
        high_score_display.innerText = `High Score: ${high_score}`;
        game_over_div.appendChild(high_score_display);

        // Restart game button
        let restart_game = document.createElement("button");
        restart_game.classList.add("game-restart-btn");
        restart_game.innerHTML = "&#8635;";
        game_over_div.appendChild(restart_game);
        display.appendChild(game_over_div);

        // Restart game on button click
        restart_game.addEventListener("click", () => {
          window.location.reload();
        });
      }

      // Bird control for keyboard and touch
      document.addEventListener("keydown", (evt) => {
        if (evt.key === " ") {
          bird.style.transform = "translateY(-600vh)";
          bird.style.transitionTimingFunction =
            "cubic-bezier(0.175, 0.885, 0.9, 2)";
        }
      });
      document.addEventListener("touchstart", () => {
        bird.style.transform = "translateY(-600vh)";
        bird.style.transitionTimingFunction =
          "cubic-bezier(0.175, 0.885, 0.9, 2)";
      });

      // Game over conditions
      if (bird_over_view.top < 0 ||
          display_over_view.bottom < bird_over_view.bottom ||
          (bird_over_view.right > pipe_over_view.left &&
          bird_over_view.left < pipe_over_view.right &&
          bird_over_view.bottom > pipe_over_view.top &&
          bird_over_view.top < pipe_over_view.bottom)) {
        game_over();
        let re_game = new Audio('game-over.mp3');
        re_game.play();
        bird.remove();
        pipe_div.remove();
      }
    }
  });
  requestAnimationFrame(run_pipe);
}

setInterval(create_nodes, 2000);
run_pipe();
