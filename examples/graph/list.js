export default {
    element: document.querySelector('ol'),
    add: function (message) {
        var li = document.createElement('li');
        li.innerText = message;
        this.element.appendChild(li);
    }
}