let currentAddress = null;
const walletStatusElement = document.getElementById("wallet-status");
const aiModal = document.getElementById("ai-modal");
const resultHeader = document.getElementById("result-title");
const resultContent = document.getElementById("result-content");
const loadingSpinner = document.getElementById("loading-spinner");
const loadingSpinner2 = document.getElementById("loading-spinner-2");
const loadingSpinner3 = document.getElementById("loading-spinner-3");
const chatBox = document.getElementById("messages");
const messageInput = document.getElementById("ai-message-input");
const addressModal = document.getElementById("address-modal");

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function openAddressModal() {
  addressModal.style.display = "flex";
}

function closeAddressModal() {
  addressModal.style.display = "none";
}

async function connectWallet() {
  // if (typeof window.ethereum === "undefined") {
  //   alert("Please install MetaMask or another Web3 wallet.");
  //   return;
  // }

  // // Show loading spinner
  if (loadingSpinner3) {
    loadingSpinner3.style.display = "block";
  }

  try {
    // // Request wallet connection
    // const [address] = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });

    // Set the connected address
    const address = document.getElementById("address-input").value.trim();
    currentAddress = address;

    if (walletStatusElement) {
      walletStatusElement.textContent = "Connected";
    }

    // Call the backend to verify the wallet
    const response = await fetch("/connect-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: currentAddress }),
    });

    const data = await response.json();

    if (data.success) {
      if (walletStatusElement) {
        walletStatusElement.textContent = `Verified: ${data.balance} Tokens`;
      }

      // Enable buttons
      document.querySelectorAll(".action-btn").forEach((btn) => {
        btn.classList.remove("disabled");
        btn.classList.add("enabled");
      });
    } else {
      if (walletStatusElement) {
        walletStatusElement.textContent =
          data.message || "Verification failed.";
      }
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    if (walletStatusElement) {
      walletStatusElement.textContent = "Connection Failed";
    }
  } finally {
    // Hide loading spinner
    if (loadingSpinner3) {
      loadingSpinner3.style.display = "none";
    }
    closeAddressModal();
  }
}

// Close AI Modal
function closeAICHAT() {
  document.getElementById("ai-modal").style.display = "none";
}

const ICO_colums = ["Project", "Round", "Ecosystem"];
const Yield_columns = ["Pool", "Project", "Chain"];

// Show Tables
async function showTable(type) {
  // Show loading spinner
  if (loadingSpinner2) {
    loadingSpinner2.style.display = "block";
  }

  try {
    if (type === "ICO") {
      const response = await fetch("/get-ico-data", {
        method: "GET",
      });

      const Jsondata = await response.json();
      const data = Jsondata.data;

      document.querySelector(
        "#table-container .table-header span"
      ).textContent = "Best ICO Advice";
      document.querySelector("#table-container h3").textContent =
        "Top ICO Recommendations";

      const thead = document.querySelector(".table .table-head");
      const tbody = document.querySelector(".table .table-body");
      thead.innerHTML = "";
      tbody.innerHTML = "";

      ICO_colums.forEach((element, index) => {
        const div = document.createElement("div");

        if (element === "Project") {
          div.textContent = element;
          div.className = "project";
        } else if (element === "Round") {
          div.textContent = element;
          div.className = "round";
        } else {
          div.textContent = "Ecosystem";
          div.className = "chain";
        }

        thead.appendChild(div);
      });

      // Iterate through the data and create table rows
      data.forEach((element, index) => {
        // Create a table row
        const tr = document.createElement("div");

        // Create and append name td
        const nameTd = document.createElement("div");
        nameTd.textContent = element.name;
        nameTd.className = "project";
        tr.appendChild(nameTd);

        // Create and append round td
        const roundTd = document.createElement("div");
        roundTd.textContent = element.round;
        roundTd.className = "round";
        tr.appendChild(roundTd);

        // Create and append ecosystem td
        const ecosystemTd = document.createElement("div");
        ecosystemTd.className = "chain";
        ecosystemTd.innerHTML = `
                Platform: ${element.ecosystem} <span>- <a href=${element.Detail} target="_blank"><button>Detail</button></a></span>
            `;
        tr.appendChild(ecosystemTd);

        // Append the row to the tbody
        tbody.appendChild(tr);
      });
    } else if (type === "Yield Farming") {
      const response = await fetch("/get-yield-data", {
        method: "GET",
      });

      const Jsondata = await response.json();
      const data = Jsondata.data;

      document.querySelector(
        "#table-container .table-header span"
      ).textContent = "Best Yield Farming";
      document.querySelector("#table-container h3").textContent =
        "Top Yield Farming Recommendations";

      const thead = document.querySelector(".table .table-head");
      const tbody = document.querySelector(".table .table-body");
      thead.innerHTML = "";
      tbody.innerHTML = "";

      Yield_columns.forEach((element, index) => {
        const div = document.createElement("div");

        if (element === "Project") {
          div.textContent = element;
          div.className = "project";
        } else if (element === "Pool") {
          div.textContent = element;
          div.className = "pool";
        } else {
          div.textContent = "Chain";
          div.className = "chain";
        }

        thead.appendChild(div);
      });

      // Iterate through the data and create table rows
      data.forEach((element, index) => {
        // Create a table row
        const tr = document.createElement("div");

        // Create and append name td
        const nameTd = document.createElement("div");
        nameTd.textContent = element.Pool;
        nameTd.className = "pool";
        tr.appendChild(nameTd);

        // Create and append round td
        const roundTd = document.createElement("div");
        roundTd.textContent = element.Project;
        roundTd.className = "project";
        tr.appendChild(roundTd);

        // Create and append ecosystem td
        const ecosystemTd = document.createElement("div");
        ecosystemTd.className = "chain";
        ecosystemTd.innerHTML = `
                Platform: ${element.Chain} <span>- <a href=${element["More Info"]} target="_blank"><button>Detail</button></a></span>
            `;
        tr.appendChild(ecosystemTd);

        // Append the row to the tbody
        tbody.appendChild(tr);
      });
    }

    document.getElementById("table-container").style.display = "flex";
    document.getElementById("table-container").style.flexDirection = "column";
    document.getElementById("table-container").style.alignItems = "center";
  } catch {
    alert("An error occured");
  } finally {
    // Hide loading spinner
    if (loadingSpinner2) {
      loadingSpinner2.style.display = "none";
    }
  }
}

async function showMoreDetails(type, id) {
  if (type == "ico") {
    const response = await fetch("/get-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: type, index: id }),
    });

    const result = await response.json();

    resultHeader.textContent = "More Details";
    resultContent.textContent = result.text;
    aiModal.style.display = "block";
  } else if (type == "yield") {
    const response = await fetch("/get-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: type, index: id }),
    });

    const result = await response.json();
    resultHeader.textContent = "More Details";
    resultContent.textContent = result.text;
    aiModal.style.display = "block";
  }
}

function closeTable() {
  document.getElementById("table-container").style.display = "none";
}

let chatHistory = [
  {
    role: "system",
    content:
      "You are SolvAI Agent, an expert AI in crypto investment analysis. Your goal is to provide users with insightful recommendations on ICOs and yield farming based on market trends, risk levels, and potential ROI. Use clear, data-driven responses.",
  },
];

function showAI() {
  document.getElementById("ai-agent-modal").style.display = "flex";
}

function closeAI() {
  document.getElementById("ai-agent-modal").style.display = "none";
}

function addMessage(role, content) {
  var messageDiv;
  if (role === "user") {
    messageDiv = document.createElement("div");
    messageDiv.classList.add("my-question");
    messageDiv.textContent = content;
  } else {
    messageDiv = document.createElement("div");
    messageDiv.classList.add("ai-response");
    messageDiv.innerHTML = `<img src="/static/asset/logo.png" alt="Logo"/> <pre>${content}</pre>`;
  }
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

// Function to send a message
async function sendMessage() {
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  // Add user message to chat history and display it
  chatHistory.push({ role: "user", content: userMessage });
  addMessage("user", userMessage);
  messageInput.value = "";

  // Send request to OpenAI API
  try {
    const response = await fetch("/ask-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      const assistantMessage = data.text;
      chatHistory.push({ role: "assistant", content: assistantMessage });
      addMessage("assistant", assistantMessage);
      console.log("Message: ", assistantMessage);
    } else {
      console.error("Error from OpenAI:", data);
      addMessage("assistant", "Sorry, I encountered an error.");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    addMessage("assistant", "Sorry, I couldn't connect to the server.");
  }
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.toggle("show");
  }
}
