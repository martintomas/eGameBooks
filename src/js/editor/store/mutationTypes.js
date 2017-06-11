//Book data mutations
export const LOAD_BOOK_DATA = 'LOAD_BOOK_DATA'
export const VALIDATE_BOOK = 'VALIDATE_BOOK'
export const SELECT_PAGE = 'SELECT_PAGE'
export const EDIT_PAGE = 'EDIT_PAGE'
export const RENDER_PAGE = 'RENDER_PAGE'
export const DELETE_PAGE = 'DELETE_PAGE'
export const ADD_PAGE = 'ADD_PAGE'
export const CHANGE_STARTING_PAGE = 'CHANGE_STARTING_PAGE'
export const MODULE_REF_DELETED = 'MODULE_REF_DELETED'
export const MODULE_REF_ADDED = 'MODULE_REF_ADDED'
export const CHANGE_LINK_PAGEID = 'CHANGE_LINK_PAGEID'
export const DELETE_ACTION = 'DELETE_ACTION'
export const ADD_ACTION = 'ADD_ACTION'
export const EDIT_ACTION = 'EDIT_ACTION'
export const DELETE_LINK = 'DELETE_LINK'
export const ADD_LINK = 'ADD_LINK'
export const CHANGE_PAGE_SETTINGS = 'CHANGE_PAGE_SETTINGS'
export const CHANGE_BOOK_NAME = 'CHANGE_BOOK_NAME'
export const CHANGE_USED_MODULES = 'CHANGE_USED_MODULES'
export const UPDATE_LAST_SAVE = 'UPDATE_LAST_SAVE'
export const BOOK_CLEAR = 'BOOK_CLEAR'
export const CHANGE_AUTOMATIC_BOOK_SAVE = 'CHANGE_AUTOMATIC_BOOK_SAVE'
export const MODIFY_SAVE_INTERVAL_OBJECT = 'MODIFY_SAVE_INTERVAL_OBJECT'

//Editor status mutations -- keeps info about editor (what is open, edited, history, etc)
export const CHANGE_MINI_PAGE_LIST_STATUS = 'CHANGE_MINI_PAGE_LIST_STATUS'
export const CHANGE_ELEMENTS_LIST_STATUS = 'CHANGE_ELEMENTS_LIST_STATUS'
export const CHANGE_MINI_PAGE_SHOWN_METHOD = 'CHANGE_MINI_PAGE_SHOWN_METHOD'
export const CHANGE_EDITOR_SHOW_PREVIEW = 'CHANGE_EDITOR_SHOW_PREVIEW'
export const CHANGE_EDITOR_SIMPLE_PREVIEW = 'CHANGE_EDITOR_SIMPLE_PREVIEW'
export const ONLY_ERROR_MINI_PAGE_SHOWN_METHOD = 'ONLY_ERROR_MINI_PAGE_SHOWN_METHOD'
export const ADD_UNDO_ACTION = 'ADD_UNDO_ACTION'
export const REMOVE_UNDO_ACTION = 'REMOVE_UNDO_ACTION'
export const ADD_REDO_ACTION = 'ADD_REDO_ACTION'
export const REMOVE_REDO_ACTION = 'REMOVE_REDO_ACTION'

//Modules mutations
export const ADD_WORKSPACES = 'ADD_WORKSPACES'
export const MODULES_PROCESS_LOCAL_DATA = 'MODULES_PROCESS_LOCAL_DATA'
export const MODULES_BUILD_REVERSE_INFO = 'MODULES_BUILD_REVERSE_INFO'
export const MODULES_UPDATE_REV = 'MODULES_UPDATE_REV'
export const MODULES_PAGE_DELETED = 'MODULES_PAGE_DELETED'
export const MODULES_PAGE_ADDED = 'MODULES_PAGE_ADDED'
export const MODULES_ACTION_DELETED = 'MODULES_ACTION_DELETED'
export const MODULES_ACTION_ADDED = 'MODULES_ACTION_ADDED'
export const MODULES_ACTION_EDITED = 'MODULES_ACTION_EDITED'
export const MODULES_CLEAR = 'MODULES_CLEAR'

//Item module mutations
export const ADD_NEW_ITEM = 'ADD_NEW_ITEM'
export const SELECTED_ITEM_CHANGED = 'SELECTED_ITEM_CHANGED'
export const DELETE_ITEM = 'DELETE_ITEM'
export const EDIT_ITEM = 'EDIT_ITEM'
export const SET_REVERSE_INFO_ITEM = 'SET_REVERSE_INFO_ITEM'