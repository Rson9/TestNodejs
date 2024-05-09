
// 上传文件
function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    if (file) {
        var formData = new FormData();
        formData.append('file', file);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = '../html/upload-success.html';
                    // 更新文件列表
                    updateFileList();
                }

                else if(response.status == 413){
                    alert('文件大小不能超过20MB');
                }
                else {
                    alert(response.status);
                }
            })

            .catch(error => {
                alert(error);
            })
    }
        else alert('请选择文件');

    }

    //获取文件列表
    function updateFileList() {
        fetch('/api/files')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // 转换为JSON
            })

            .then(fileList => {
                const fileListElement = document.getElementById('fileList');
                // 你可以在这里将文件列表渲染到页面上
                fileList.forEach(fileName => {
                    const listItem = document.createElement('li');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox'; // 设置类型为复选框
                    checkbox.className = 'checked-file';
                    checkbox.value = fileName;
                    // 将复选框添加到 <li> 中
                    listItem.appendChild(checkbox);
                    listItem.className = 'file-list';

                    // 设置 <li> 的文本内容为文件名，并确保文本紧跟复选框之后
                    listItem.appendChild(document.createTextNode(fileName));

                    // 将 <li> 添加到 <ul> 中
                    document.getElementById('fileList').appendChild(listItem);
                });
            })

            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    // 下载文件
    function downloadFile() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        // 获取要下载的文件名，存入数组
        const selectedFiles = Array.from(checkboxes).map(checkbox => checkbox.value);
        if (selectedFiles.length === 0) {
            alert('请选择要下载的文件');
            return;
        }
        selectedFiles.forEach((file) => {
            fetch(`/download/${file}`)
                .then(response => response.blob())
                .then(blob => {
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.setAttribute('download', file);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                })
                .catch(error => console.error('Error downloading file:', error));
        });

    }

    // 初始化文件列表
    updateFileList();