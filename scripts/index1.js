const btn = document.getElementById("btn");

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const uploadFile = async (event) => {};

$("form").on("submit", async function (event) {
  //ajax call here

  //stop form submission
  event.preventDefault();
  let file = $("#selectFile").prop("files")[0];
  console.log("form submitted", file);
  // console.log(file);
  // const file = event.target.files[0];
  const data = await convertBase64(file);
  // console.log(data);
  var request = {
    url: "http://localhost:3000/upload2",
    method: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({ data }),
  };
  $.ajax(request).done(function (response) {
    console.log("file uploaded", response);
    const display = document.getElementById("msg");
    display.innerHTML = response.msg;
    $("#inputForm")[0].reset();
  });
});
