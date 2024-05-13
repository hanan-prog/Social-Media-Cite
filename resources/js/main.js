document.addEventListener("DOMContentLoaded", content_loaded);


function content_loaded() {
  const btn = document.querySelectorAll('.likePost');
  btn.forEach(likebtn => {
    likebtn.addEventListener("click", ()=> {
      const id = likebtn.getAttribute('data-id');
      handleLike(id);
    })
  });

  const deletePostBtn = document.querySelectorAll('.deletePost');
  deletePostBtn.forEach(deletebtn => {
    deletebtn.addEventListener("click", ()=> {
      const id = deletebtn.getAttribute('data-id');
      handleDelete(id);
    })
  });


  const editPostBtn = document.querySelectorAll('.editPost');
  editPostBtn.forEach(editbtn => {
    editbtn.addEventListener("click", ()=> {
      const id = editbtn.getAttribute('data-id');
      handleEdit(id);
    })
  });
}


async function handleDelete(id) {
  const URL = "http://localhost:4131/delete/" + id;
  const response = await fetch(URL, {
    method: "DELETE",
  });

  if (response.status == 200 || response.status == 404) {
    // not in server so we can delete row from the front end
    const div = document.getElementById(id);
    div.remove();
  }
}

// event handler for liking a post. Sends a request to the server to update the likes before updating the front end
async function handleLike(id) {
  const URL = "http://localhost:4131/like/" + id;
  const response = await fetch(URL, {
    method: "POST",
  });

  if (response.status == 200) {
    // update the front end
    const div = document.getElementById(id);
    const likes = div.querySelector("#likeCount");
    let likesNum = parseInt(likes.textContent);
    if (isNaN(likesNum)) {
      likesNum = 0;
    }
    likes.textContent = likesNum + 1;
  }
}

function handleEdit(id) {
  let div = document.getElementById(id);
  div.innerHTML = `
  <form action="/update/${id}" method="POST">
    <textarea name="newPost" id="newPost"></textarea>
    <button type="submit">Submit</button>
  </form>
  `;

  if (response.status == 200) {
    // update the front end
    div.querySelector("#newPost").textContent = response.post_data;
  }
}



