// theme
export const LOAD_THEME = 'load theme'

// question
export const RECEIVE_QUESTION_REQUEST = '[question] receive question request'
export const RECEIVE_QUESTION_SUCCESS = '[question] receive question success'
export const RECEIVE_QUESTION_ERROR = '[question] receive question error'

export const SAVE_QUESTION_REQUEST = '[question] save question request'
export const SAVE_QUESTION_SUCCESS = '[question] save question success'
export const SAVE_QUESTION_ERROR = '[question] save question error'

export const SET_QUESTION_DATA = '[question] set question data'
export const SET_QUESTION_ALIGNMENT_ADD_ROW =
  '[question] set question alignment add row'
export const SET_QUESTION_ALIGNMENT_REMOVE_ROW =
  '[question] set question alignment remove row'
export const SET_QUESTION = '[question] set question'
export const LOAD_QUESTION = '[quesiton] load question from testItem'

// assessment
export const LOAD_ASSESSMENT = 'load assessment'

// view
export const CHANGE_VIEW = '[view] CHANGE_VIEW'
export const CHANGE_PREVIEW = '[view] change view'

// preview
export const PREVIEW_UPDATE_LIST = '[preview] PREVIEW_UPDATE_LIST'
export const CHANGE_PREVIEW_TAB = '[preview] CHANGE_PREVIEW_TAB'

// items
export const RECEIVE_ITEMS_REQUEST = '[items] receive items request'
export const RECEIVE_ITEMS_SUCCESS = '[items] receive items success'
export const RECEIVE_ITEMS_ERROR = '[items] receive items error'

export const RECEIVE_ITEM_REQUEST = '[items] receive item request'
export const RECEIVE_ITEM_SUCCESS = '[items] receive item success'
export const RECEIVE_ITEM_ERROR = '[items] receive item error'
export const CREATE_ITEM_REQUEST = '[items] create item request'
export const UPDATE_ITEM_REQUEST = '[items] update item request'

// item detail
export const RECEIVE_ITEM_DETAIL_REQUEST = '[itemDetail] receive request'
export const RECEIVE_ITEM_DETAIL_SUCCESS = '[itemDetail] receive success'
export const RECEIVE_ITEM_DETAIL_ERROR = '[itemDetail] receive error'

export const UPDATE_ITEM_DETAIL_REQUEST = '[itemDetail] update by id request'
export const UPDATE_ITEM_DETAIL_SUCCESS = '[itemDetail] update by id success'
export const UPDATE_ITEM_DETAIL_ERROR = '[itemDetail] update by id error'

export const SET_ITEM_DETAIL_DATA = '[itemDetail] set data'
export const UPDATE_ITEM_DETAIL_DIMENSION = '[itemDetail] update dimension'

export const SET_DRAGGING = '[itemDetail] set dragging'

export const DELETE_ITEM_DETAIL_WIDGET = '[itemDetail] delete widget'
export const UPDATE_TAB_TITLE = '[itemDetail] update tab title'
export const USE_TABS = '[itemDetail] is use tabs'
export const MOVE_WIDGET = '[itemDetail] move widget'

// item list
export const APPROVE_OR_REJECT_SINGLE_ITEM_REQUEST =
  '[item list] approve or reject single item request'
export const APPROVE_OR_REJECT_SINGLE_ITEM_SUCCESS =
  '[item list] approve or reject single item success'
export const APPROVE_OR_REJECT_MULTIPLE_ITEM_REQUEST =
  '[item list] approve or reject multiple items request'
export const APPROVE_OR_REJECT_MULTIPLE_ITEM_SUCCESS =
  '[item list] approve or reject multiple items success'

// Test items
export const RECEIVE_TEST_ITEMS_REQUEST = '[testItems] receive items request'
export const RECEIVE_TEST_ITEMS_SUCCESS = '[testItems] receive items success'
export const RECEIVE_TEST_ITEMS_ERROR = '[testItems] receive items error'
export const SET_TEST_ITEMS_REQUEST = '[testItems] set items request'

// Test item
export const CREATE_TEST_ITEM_REQUEST = '[testItem] create item request'
export const CREATE_TEST_ITEM_SUCCESS = '[testItem] create item success'
export const CREATE_TEST_ITEM_ERROR = '[testItem] create item error'

export const UPDATE_TEST_ITEM_REQUEST = '[testItem] update by id request'
export const UPDATE_TEST_ITEM_SUCCESS = '[testItem] update by id success'
export const UPDATE_TEST_ITEM_ERROR = '[testItem] update by id error'

export const CHECK_ANSWER = '[testItem] evaluate test item'
export const SHOW_ANSWER = '[testItem] show test item answer'

export const ADD_ITEM_EVALUATION = '[evaluation] add evaluation'
export const CLEAR_ITEM_EVALUATION = '[evaluation] clear evaluation'

export const TOGGLE_CREATE_ITEM_MODAL = '[testItem] toggle create item modal'

export const CORRECT_ITEM_UPDATE_REQUEST =
  '[testItem] update correct testItem in LCB request'
export const SET_CORRECT_ITEM_UPDATE_PROGRESS =
  '[testItem] update correct testItem in LCB success'
export const TOGGLE_REGRADE_MODAL = '[tests] toggle regrade modal in LCB'
export const SET_SILENT_CLONING = '[testItem] enable silent cloning'

// Tests
export const RECEIVE_TESTS_REQUEST = '[tests] receive list request'
export const RECEIVE_TESTS_SUCCESS = '[tests] receive list success'
export const RECEIVE_TESTS_ERROR = '[tests] receive list error'

export const CREATE_TEST_REQUEST = '[tests] create test request'
export const CREATE_TEST_SUCCESS = '[tests] create test success'
export const CREATE_TEST_ERROR = '[tests] create test error'

export const UPDATE_TEST_REQUEST = '[tests] update test request'
export const UPDATE_TEST_SUCCESS = '[tests] update test success'
export const UPDATE_TEST_ERROR = '[tests] update test error'

export const RECEIVE_TEST_BY_ID_REQUEST = '[tests] receive test by id request'
export const RECEIVE_TEST_BY_ID_SUCCESS = '[tests] receive test by id success'
export const RECEIVE_TEST_BY_ID_ERROR = '[tests] receive test by id error'

export const SET_TEST_DATA = '[tests] set test data'
export const SET_DEFAULT_TEST_DATA = '[tests] set default test data'

// ui
export const TOGGLE_MENU = '[homeUI] toggle menu'
export const RESPONSIVE_TOGGLE_MENU = '[homeUI] responsive toggle menu'
export const ADD_LOADING_COMPONENT = '[authorUi] add loading component'
export const REMOVE_LOADING_COMPONENT = '[authorUi] remove loading component'

// Dictionaries
export const RECEIVE_DICT_CURRICULUMS_REQUEST =
  '[dictionaries] receive curriculums request'
export const RECEIVE_DICT_CURRICULUMS_SUCCESS =
  '[dictionaries] receive curriculums success'
export const RECEIVE_DICT_CURRICULUMS_ERROR =
  '[dictionaries] receive curriculums error'
export const RECEIVE_DICT_STANDARDS_REQUEST =
  '[dictionaries] receive standards request'
export const RECEIVE_DICT_STANDARDS_SUCCESS =
  '[dictionaries] receive standards success'
export const RECEIVE_DICT_STANDARDS_ERROR =
  '[dictionaries] receive standards error'

export const RECEIVE_TLO_STANDARDS_REQUEST =
  '[dictionaries] receive tlo standards request'
export const RECEIVE_TLO_STANDARDS_SUCCESS =
  '[dictionaries] receive tlo standards success'

export const RECEIVE_ELO_STANDARDS_REQUEST =
  '[dictionaries] receive elo standards request'
export const RECEIVE_ELO_STANDARDS_SUCCESS =
  '[dictionaries] receive elo standards success'
export const SET_ELOS_BY_TLO_ID = '[dictionaries] set elos by tloId'
export const CLEAR_DICT_STANDARDS = '[dictionaries] clear standards'
export const CLEAR_TLO_AND_ELO = '[dictionaries] clear TLO and ELOs'
export const RESET_DICT_ALIGNMENTS = '[dictionaries] reset alignment standards'
export const CLEAR_DICT_ALIGNMENTS = '[dictionaries] clear alignments'
export const ADD_DICT_ALIGNMENT = '[dictionaries] add alignment'
export const REMOVE_DICT_ALINMENT = '[dictionaries] remove alignment'
export const ADD_NEW_ALIGNMENT = '[question alignment] add new alignment'
export const REMOVE_EXISTED_ALIGNMENT =
  '[question alignment] remove existed alignment'
export const SET_ALIGNMENT_FROM_QUESTION =
  '[question alignment] set alignment from question'
export const UPDATE_DICT_ALIGNMENT = '[dictionaries] update alignment'
export const UPDATE_RECENT_STANDARDS = '[dictionaries] update recent standards'
export const UPDATE_DEFAULT_CURRICULUM =
  '[dictionaries] update default curriculum'
export const UPDATE_RECENT_COLLECTIONS =
  '[dictonaries] update recent collections'

// ClassResponse
export const RECEIVE_CLASS_RESPONSE_REQUEST =
  '[classresponses] receive list request'
export const RECEIVE_CLASS_RESPONSE_SUCCESS =
  '[classresponses] receive list success'
export const RECEIVE_CLASS_RESPONSE_ERROR =
  '[classresponses] receive list error'
export const UPDATE_STUDENT_TEST_ITEMS =
  '[classresponses] update student test items'
export const REPLACE_ORIGINAL_ITEM = '[classresponses] replace original item'
export const RECEIVE_STUDENT_RESPONSE_REQUEST =
  '[studentResponse] receive list request'
export const RECEIVE_STUDENT_RESPONSE_SUCCESS =
  '[studentResponse] receive list success'
export const RECEIVE_STUDENT_RESPONSE_ERROR =
  '[studentResponse] receive list error'
export const RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST =
  '[classStudentResponse] receive list request'
export const RECEIVE_CLASSSTUDENT_RESPONSE_SUCCESS =
  '[classStudentResponse] receive list success'
export const ADD_CLASS_STUDENT_RESPONSE = '[classStudentResponse] add response'
export const RECEIVE_CLASSSTUDENT_RESPONSE_ERROR =
  '[classStudentResponse] receive list error'
export const SET_CLASS_STUDENT_RESPONSES_LOADING =
  '[classStudentResponse] set print preview loading'
export const RECEIVE_FEEDBACK_RESPONSE_REQUEST =
  '[feedbackResponse] receive list request'
export const RECEIVE_FEEDBACK_RESPONSE_SUCCESS =
  '[feedbackResponse] receive list success'
export const CLEAR_FEEDBACK_RESPONSE =
  '[feedbackResonse] clear feedback response'
export const RECEIVE_FEEDBACK_RESPONSE_ERROR =
  '[feedbackResponse] receive list error'

// Classboard
export const RECEIVE_GRADEBOOK_REQUEST = '[gradebook] receive list request'
export const RECEIVE_GRADEBOOK_SUCCESS = '[gradebook] receive list success'
export const RECEIVE_GRADEBOOK_ERROR = '[gradebook] receive list error'
export const UPDATE_RELEASE_SCORE = '[gradebook] release score'
export const SET_MARK_AS_DONE = '[gradebook] mark as done'
export const UPDATE_ASSIGNMENT_STATUS = '[gradebook] set assignment status'
export const OPEN_ASSIGNMENT = '[gradebook] open assignment'
export const CLOSE_ASSIGNMENT = '[gradebook] close assignment'
export const UPDATE_OPEN_ASSIGNMENTS = '[gradebook] update open assignments'
export const UPDATE_CLOSE_ASSIGNMENTS = '[gradebook] update close assignments'
export const SAVE_OVERALL_FEEDBACK = '[gradebook] save overall feedback'
export const UPDATE_OVERALL_FEEDBACK = '[gradebook] update overalll feedback'
export const MARK_AS_ABSENT = '[gradebook] mark student/students as absent'
export const MARK_AS_SUBMITTED =
  '[gradebook] mark student/students as submitted'
export const PAUSE_STUDENTS = '[gradebook] pause students'
export const UPDATE_PAUSE_STATUS_ACTION =
  'gradebook update paused status on cards'

export const UPDATE_SUBMITTED_STUDENTS =
  '[gradebook] update student activity as submitted'
export const DOWNLOAD_GRADES_RESPONSES =
  '[gradebook] download grades and responses'

export const UPDATE_STUDENT_ACTIVITY =
  '[gradebook] update student activity as absent'
export const TOGGLE_PAUSE_ASSIGNMENT = '[gradebook] toggle pause assignment'
export const SET_IS_PAUSED = '[gradebook] set is paused'
export const UPDATE_STUDENTS_DATA = '[gradebook] update entity data'

export const REMOVE_STUDENTS = '[gradebook] remove students'
export const ADD_STUDENTS = '[gradebook] add students'
export const FETCH_STUDENTS = '[gradebook] fetch students by class id'
export const UPDATE_REMOVED_STUDENTS_LIST =
  '[gradebook] update student activity as absent'
export const UPDATE_STUDENTS_LIST = '[gradebook] update removed students list'
export const UPDATE_CLASS_STUDENTS_LIST =
  '[gradebook] update class students list'
export const SET_CURRENT_TESTACTIVITY = '[gradebook]set current testActivity Id'
export const GET_ALL_TESTACTIVITIES_FOR_STUDENT =
  '[gradebook] get all testactivities for student'
export const SET_ALL_TESTACTIVITIES_FOR_STUDENT =
  '[gradebook] set all testactivities for student'
export const REDIRECT_TO_ASSIGNMENTS = '[gradebook] redirect to assignments'
export const TOGGLE_VIEW_PASSWORD_MODAL =
  '[gradebook] toggle view password modal'
export const REGENERATE_PASSWORD = '[gradebook] regenerate password action'
export const UPDATE_PASSWORD_DETAILS =
  '[gradebook] update password details action'
export const SET_UPDATED_ACTIVITY_IN_ENTITY =
  '[gradebook] set updated activityId in entity'

export const FETCH_SERVER_TIME = '[gradebook] fetch server time'

export const CANVAS_SYNC_GRADES = '[gradebook] sync grades with canvas'
export const CANVAS_SYNC_ASSIGNMENT = '[gradebook] sync assignment with canvas'
export const SET_SHOW_CANVAS_SHARE =
  '[gradebook] set show canvas share notification'

export const RECEIVE_TESTACTIVITY_REQUEST =
  '[testActivity] receive list request'
export const RECEIVE_TESTACTIVITY_SUCCESS =
  '[testActivity] receive list success'
export const RECEIVE_TESTACTIVITY_ERROR = '[testActivity] receive list error'
export const TOGGLE_PRESENTATION_MODE =
  '[testActivity] toggle presentation mode'
export const RESPONSE_ENTRY_SCORE_SUCCESS =
  '[testActivity] response entry score success'

// assignments
export const RECEIVE_ASSIGNMENTS_REQUEST = '[assignments] receive list request'
export const RECEIVE_ASSIGNMENTS_SUCCESS = '[assignments] receive list success'
export const RECEIVE_ASSIGNMENTS_ERROR = '[assignments] receive list error'

export const RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST =
  '[assignmentsSummary] receive list request'
export const RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS =
  '[assignmentsSummary] receive list success'
export const RECEIVE_ASSIGNMENTS_SUMMARY_ERROR =
  '[assignmentsSummary] receive list error'

export const RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST =
  '[assignment’s class list] receive list request'
export const RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS =
  '[assignment’s class list] receive list success'
export const RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR =
  '[assignment’s class list] receive list error'
export const SET_ASSIGNMENT_FILTER = '[assignments] set assignment filter'

export const FETCH_CURRENT_EDITING_ASSIGNMENT =
  '[assignments] fetch assignment data'
export const FETCH_CURRENT_ASSIGNMENT =
  '[assignments] fetch assignment using assignment id'
export const UPDATE_CURRENT_EDITING_ASSIGNMENT =
  '[assignments] save current assignment'
export const UPDATE_RELEASE_SCORE_SETTINGS =
  '[assignments] update assignment settings'
export const TOGGLE_RELEASE_GRADE_SETTINGS =
  '[assignments] show release grade settings'

export const TOGGLE_DELETE_ASSIGNMENT_MODAL =
  '[assignments] toggle delete assignment modal'
export const DELETE_ASSIGNMENT_REQUEST =
  '[assignments] toggle delete assignment request'
export const DELETE_ASSIGNMENT_REQUEST_SUCCESS =
  '[assignments] delete assignment request success'
export const DELETE_ASSIGNMENT_REQUEST_FAILED =
  '[assignments] delete assignment request failed'

export const ADVANCED_ASSIGNMENT_VIEW = '[assignments] change view'

export const EDIT_TAGS_REQUEST = '[assignments] edit tags request'
export const SET_TAGS_UPDATING_STATE = '[assignments] set tags updating state'

export const RECEIVE_CLASS_QUESTION_REQUEST = '[answers] receive list request'
export const RECEIVE_CLASS_QUESTION_SUCCESS = '[answers] receive list success'
export const RECEIVE_CLASS_QUESTION_ERROR = '[answers] receive list error'

export const RECEIVE_STUDENT_QUESTION_REQUEST = '[answer] receive list request'
export const RECEIVE_STUDENT_QUESTION_SUCCESS = '[answer] receive list success'
export const RECEIVE_STUDENT_QUESTION_ERROR = '[answer] receive list error'

export const SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST =
  '[LCB] sync assignment with google classroom request'
export const SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_SUCCESS =
  '[LCB] sync assignment with google classroom success'
export const SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR =
  '[LCB] sync assignment with google classroom error'
export const TOGGLE_STUDENT_REPORT_CARD_SETTINGS =
  '[assignments] show student report card popup'

export const SET_SHARE_WITH_GC_PROGRESS =
  '[LCB] set share with google classroom progress'

export const SYNC_ASSIGNMENT_GRADES_WITH_GOOGLE_CLASSROOM_REQUEST =
  '[LCB] sync assignment grades with google classroom request'

export const SYNC_ASSIGNMENT_GRADES_WITH_CLEVER_REQUEST =
  '[LCB] sync assignment grades with clever request'

export const SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_REQUEST =
  '[LCB] sync assignment with schoology classroom request'
export const SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_SUCCESS =
  '[LCB] sync assignment with schoology classroom success'
export const SYNC_ASSIGNMENT_WITH_SCHOOLOGY_CLASSROOM_ERROR =
  '[LCB] sync assignment with schoology classroom error'
export const SYNC_ASSIGNMENT_GRADES_WITH_SCHOOLOGY_CLASSROOM_REQUEST =
  '[LCB] sync assignment grades with schoology classroom request'
// answers
export const CLEAR_ANSWERS = '[answers] clear answers'

// upload image
export const UPDATE_TEST_IMAGE = 'update test image'

// logout
export const LOGOUT = '[auth] logout' // set redux store to initial values

// test page
export const SET_MAX_ATTEMPT = '[tests] maximum attempt'

export const SET_SAFE_BROWSE_PASSWORD = '[tests] safe browser password'

// -----|-----|-----|----- REPORTS BEGIN -----|-----|-----|----- //

export const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST =
  '[reports] get reports assessment summary'
export const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_SUCCESS =
  '[reports] get reports assessment summary success'
export const GET_REPORTS_ASSESSMENT_SUMMARY_REQUEST_ERROR =
  '[reports] get reports assessment summary error'

// -----|-----|-----|----- REPORTS ENDED -----|-----|-----|----- //

// -----|-----|-----|----- FOLDERS BEGIN -----|-----|-----|----- //

export const RECEIVE_FOLDER_REQUEST = '[folder] get folders request'
export const RECEIVE_FOLDER_SUCCESS = '[folder] get folders success'
export const RECEIVE_FOLDER_ERROR = '[folder] get folders error'

export const RECEIVE_FOLDER_CREATE_REQUEST = '[folder] create folder request'
export const RECEIVE_FOLDER_CREATE_SUCCESS = '[folder] create folder success'
export const RECEIVE_FOLDER_CREATE_ERROR = '[folder] create folder error'

export const ADD_MOVE_FOLDER_REQUEST = '[folder] move content to folder request'
export const ADD_MOVE_FOLDER_SUCCESS = '[folder] move content to folder success'
export const ADD_MOVE_FOLDER_ERROR = '[folder] move content to folder error'

export const DELETE_FOLDER_REQUEST = '[folder] delete a folder request'
export const DELETE_FOLDER_SUCCESS = '[folder] delete a folder success'
export const DELETE_FOLDER_ERROR = '[folder] delete a folder error'

export const RENAME_FOLDER_REQUEST = '[folder] rename folder request'
export const RENAME_FOLDER_SUCCESS = '[folder] rename folder success'
export const RENAME_FOLDER_ERROR = '[folder] rename folder error'

export const REMOVAL_ITEMS_FROM_FOLDER_REQUEST =
  '[folder] remove items from a folder request'
export const REMOVAL_ITEMS_FROM_FOLDER_SUCCESS =
  '[folder] remove items from a folder success'
export const REMOVAL_ITEMS_FROM_FOLDER_ERROR =
  '[folder] remove items from a folder error'

export const SET_FOLDER = '[folder] set folder'
export const CLEAR_FOLDER = '[folder] clear folder'

export const SET_ITEMS_TO_ADD = '[folder] set items to move'
export const TOGGLE_REMOVE_ITEMS_FROM_FOLDER =
  '[folder] open remove items from folder modal'
export const TOGGLE_MOVE_ITEMS_TO_FOLDER = '[folder] move items to a folder'
export const SET_CONTENTS_UPDATED = '[folder] toggle conents updated'
// -----|-----|-----|----- FOLDERS ENDED -----|-----|-----|----- //

// playlist
export const UPDATE_PLAYLISTS_SUCCESS = '[playlists] update success'
export const CREATE_PLAYLISTS_SUCCESS = '[playlists] create success'

//
export const SET_QUESTION_CATEGORY =
  '[pickUpQuestion] set question category success'
export const SET_QUESTION_TAB = '[pickUpQuestion] set question tab success'
export const SET_SCROLL_TOP = '[pickUpQuestion] set scroll top value'

export const MQTT_CLIENT_SAVE_REQUEST = '[mqtt] Client saved'
export const MQTT_CLIENT_REMOVE_REQUEST = '[mqtt] Client removed'

export const TOGGLE_QUESTION_EDIT_MODAL_LCB =
  '[edit question] toggle question edit modal in lcb correct item'

export const SET_EDIT_ITEM_ID = '[edit question] set edit itemId'
export const SET_CURRENT_STUDENT_ID = '[edit question] set current student id'

export const RELOAD_LCB_DATA_IN_STUDENT_VIEW =
  '[lcb] reload lcb data in student view'

export const SET_BULK_UPDATE_ASSIGNMENT_SETTINGS_CALL_STATE =
  '[assignments] bulk update assignment settings call state'

export const BULK_UPDATE_ASSIGNMENT_SETTINGS =
  '[assignments] bulk update assignment settings'

export const SET_AI_GENERATE_QUESTION_STATE =
  '[ai generate question] set AI generate question state'

export const FETCH_AI_GENERATE_QUESTION =
  '[ai generate question] fetch AI generate question'

export const SET_REALTIME_ATTEMPT_DATA = '[gradebook] set realtime attempt data'

// view TTS text
export const SET_TTS_TEXT_STATE = '[view tts text] set tts text state'

export const FETCH_TTS_TEXT = '[view tts text] fetch view tts text'

// update TTS text
export const SET_TTS_UPDATE_DATA = '[update tts text] set tts update data'
export const UPDATE_TTS_TEXT = '[update tts text] update tts text'

export const UPDATE_SELECTED_STUDENT_ATTEMPT_REQUEST =
  '[lcb] update selected student attempt'
