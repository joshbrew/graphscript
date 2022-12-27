export default {
    element: document.querySelector('ol'),
    add: function (message) {
        var li = document.createElement('li');
        li.innerText = message;
        this.element.appendChild(li);
    },
    addCommand: function (message) {
        var li = document.createElement('div');
        li.innerText = message;
        li.style.fontWeight = 'bold';
        this.element.appendChild(li);
    },
    addHeader: function (message) {
        var li = document.createElement('h3');
        li.innerText = message;
        this.element.appendChild(li);
    },
}