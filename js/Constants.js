const STATS_PATH = '/stats';
const USERS_PATH = '/users';

const STATS_POLL_INTERVAL = 3000;

const STATS_UNAVAILABLE = "Stats unavailable";

const OS_MONITORING_APP = 'OSMonitoring.App';
const OS_MONITORING_COMPONENT = 'OSMonitoring';

const OS_MONITORING_PAGE_MAIN = 'OSMonitoring.Pages.Main';
const OS_MONITORING_PAGE_STATS = 'OSMonitoring.Pages.Stats';
const OS_MONITORING_PAGE_USERS_LISTING = 'OSMonitoring.Pages.UsersListing';
const OS_MONITORING_PAGE_CREATE_USER = 'OSMonitoring.Pages.CreateUser';

const OS_MONITORING_PAGE_STATS_TITLE = 'OS Stats';
const OS_MONITORING_PAGE_USERS_LISTING_TITLE = 'Users Listing';
const OS_MONITORING_PAGE_CREATE_USER_TITLE = 'Create User';

const OS_MONITORING_VIEW_MAIN = 'OSMonitoring.Views.Main';
const OS_MONITORING_VIEW_STATS = 'OSMonitoring.Views.Stats';
const OS_MONITORING_VIEW_USERS_LISTING = 'OSMonitoring.Views.UsersListing';
const OS_MONITORING_VIEW_CREATE_USER = 'OSMonitoring.Views.CreateUser';

const OS_MONITORING_BASE_CONTROLLER = 'OSMonitoring.Controllers.Base';
const OS_MONITORING_CONTROLLER_MAIN = 'OSMonitoring.Controllers.Main';
const OS_MONITORING_CONTROLLER_STATS = 'OSMonitoring.Controllers.Stats';
const OS_MONITORING_CONTROLLER_USERS_LISTING = 'OSMonitoring.Controllers.UsersListing';
const OS_MONITORING_CONTROLLER_CREATE_USER = 'OSMonitoring.Controllers.CreateUser';

const SIDE_NAV_TOGGLE_BUTTON = "sideNavigationToggleButton";
const NAV_HOME = 'home';
const NAV_STATS = 'stats';
const NAV_USERS = 'users';
const NAV_USERS_LISTING = 'usersListing';
const NAV_CREATE_USER = 'createUser';

const ROUTING_METADATA_CONFIG = {
    rootView: {
        viewName: OS_MONITORING_VIEW_MAIN,
        type: "JS",
        async: true,
        id: OS_MONITORING_VIEW_MAIN
    },
    routing: {
        routes: {
            [NAV_HOME]: {
                pattern: ""
            },
            [NAV_STATS]: {
                pattern: NAV_STATS
            },
            [NAV_USERS_LISTING]: {
                pattern: NAV_USERS
            },
            [NAV_CREATE_USER]: {
                pattern: NAV_USERS + "/create"
            }
        }
    }
};

const THEMES = [
    {
        name: "SAP Fiori 3",
        id: "sap_fiori_3"
    },
    {
        name: "SAP Fiori 3 Dark",
        id: "sap_fiori_3_dark"
    },
    {
        name: "SAP Fiori 3 High Contrast Black",
        id: "sap_fiori_3_hcb"
    },
    {
        name: "SAP Fiori 3 High Contrast White",
        id: "sap_fiori_3_hcw"
    },
    {
        name: "SAP Belize",
        id: "sap_belize"
    },
    {
        name: "SAP Belize Plus",
        id: "sap_belize_plus"
    },
    {
        name: "SAP Belize High Contrast Black",
        id: "sap_belize_hcb"
    },
    {
        name: "SAP Belize High Contrast White",
        id: "sap_belize_hcw"
    }
];

const DEFAULT_THEME = THEMES[0].id;
const SAVED_THEME_STORAGE_PREFIX = 'osMonitoringThemeChoiceStorage';