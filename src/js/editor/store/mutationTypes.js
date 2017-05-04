//Book data mutations
export const LOAD_BOOK_DATA = 'LOAD_BOOK_DATA'
export const SELECT_PAGE = 'SELECT_PAGE'
export const EDIT_PAGE = 'EDIT_PAGE'
export const RENDER_PAGE = 'RENDER_PAGE'
export const DELETE_PAGE = 'DELETE_PAGE'
export const NEW_PAGE = 'NEW_PAGE'

//Editor status mutations -- keeps info about editor (what is open, edited, history, etc)
export const CHANGE_MINI_PAGE_LIST_STATUS = 'CHANGE_MINI_PAGE_LIST_STATUS'
export const CHANGE_ELEMENTS_LIST_STATUS = 'CHANGE_ELEMENTS_LIST_STATUS'
export const CHANGE_MINI_PAGE_SHOWN_METHOD = 'CHANGE_MINI_PAGE_SHOWN_METHOD'
export const ONLY_ERROR_MINI_PAGE_SHOWN_METHOD = 'ONLY_ERROR_MINI_PAGE_SHOWN_METHOD'
export const ADD_UNDO_ACTION = 'ADD_UNDO_ACTION'
export const REMOVE_UNDO_ACTION = 'REMOVE_UNDO_ACTION'