// for user-experience
const deleteButtons = document.querySelectorAll(".deleteBtn");
let btn;

deleteButtons.forEach((item) => {
  item.addEventListener("click", (e) => {
    // console.log(e.target.parentNode.querySelector("[name=productId]").value);
    if (e.target.classList[0] === "fas") {
      btn = e.target.parentNode.parentNode;
    } else {
      btn = e.target.parentNode;
    }

    deleteProduct(btn);
  });
});

const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch(console.log);
};
