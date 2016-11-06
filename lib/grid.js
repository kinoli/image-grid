/**
 * Handles the grid logic
 */
var loadGrid = function () {
    var scope = this,
        gridHolder = document.getElementById('grid-holder'),
        gridUl = gridHolder.getElementsByTagName('ul')[0],
        liAry,
        selectedLi, // the selected li
        dragLi, // the li that is being dragged
        highlightLi, // the grey box highlighting the potential drop location
        highlightIndex, // the current index of the highlight li box
        startDragOffset, // the initial offset of the cursor
        cursorX, // allow us to know the cursor x position outside events
        cursorY; // allow us to know the cursor y position outside events

    scope = {
        /**
         * Initialization of necessary events
         */
        init: function() {
            liAry = scope.getListItems();
            gridHolder.addEventListener('mousedown', scope.mouseDown, false);            
            document.addEventListener('mouseup', scope.onRelease, false);
        },

        /**
         * Releases the drag object when user performs mouseup event
         */
        onRelease: function() {
            window.removeEventListener('mousemove', scope.onMouseDragging, true);

            if (selectedLi) {
                selectedLi.className = '';
                scope.removeDrag();
            }
        },

        /**
         * Determines if drag event should begin
         * @param  {event} e The mouse down event
         */
        mouseDown: function(e) {
            if (e.target.nodeName === 'IMG') {
                e.preventDefault();

                scope.rememberCursorPos(e);
                selectedLi = scope.getElementUnderMouse();        

                startDragOffset = {
                    left: cursorX - selectedLi.offsetLeft,
                    top: cursorY - selectedLi.offsetTop
                }

                scope.createDrag();
                scope.createHighlight();

                window.addEventListener('mousemove', scope.onMouseDragging, true);
            }
        },

        /**
         * handles drag logic
         * @param  {event} e the mouse move event
         */
        onMouseDragging: function(e) {
            var underMouse,
                overIndex;

            scope.rememberCursorPos(e);
            underMouse = scope.getElementUnderMouse();
            overIndex = scope.getLiIndex(underMouse);

            if (overIndex !== null && overIndex !== highlightIndex) {
                scope.moveHighlight(overIndex);
            }
            scope.positionDrag();
        },

        /**
         * positions the drag element
         */
        positionDrag: function() {
            dragLi.style.left = (cursorX - startDragOffset.left) + 'px';
            dragLi.style.top = (cursorY - startDragOffset.top) + 'px';        
        },

        /**
         * sets up the highlight element
         */
        createHighlight: function() {
            highlightLi = selectedLi;
            highlightLi.className = 'highlight';
            liAry = scope.getListItems();
        },

        /**
         * Moves the highlight element in line with the mouse
         * @param  {int} index the index of the list element underneath the dragged element
         */
        moveHighlight: function(index) {
            liAry = scope.getListItems();
            if (index > highlightIndex) {
                index++;           
            }
            highlightIndex = index;
            gridUl.insertBefore(highlightLi, liAry[index]);
        },

        /**
         * Builds the dragged element and ads it to the li list
         */
        createDrag: function() {
            dragLi = selectedLi.cloneNode(true);
            dragLi.className = 'drag';
            gridUl.appendChild(dragLi);
            scope.positionDrag();
        },

        /**
         * Destroys the drag element
         */
        removeDrag: function() {
            dragLi.remove();
        },

        /**
         * Stores the cursor position so we can use it ouside an event
         * @param  {event} e any mouse event
         */
        rememberCursorPos: function(e) {
            cursorX = e.pageX;
            cursorY = e.pageY;        
        },

        /**
         * Retrieves the list element underneath the mouse during a drag
         * @return {node} the element beneath the mouse
         */
        getElementUnderMouse: function() {
            return document.elementFromPoint(cursorX, cursorY).parentElement;
        },

        /**
         * Retrieves the index of a desired node
         * @param  {node} node the node we want the index of
         * @return {int|null}      the index of the node
         */
        getLiIndex: function(node) {
            for (i = 0; i < liAry.length; i++) {
                if (node == liAry[i]) {
                    return i;
                }
            }
            return null;
        },

        /**
         * Gets all list items
         * @return {array} all of the list items in our grid
         */
        getListItems: function() {
            return gridHolder.getElementsByTagName('li')
        }
    };

    scope.init();
}

window.onload = loadGrid;