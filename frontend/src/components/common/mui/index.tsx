// Layout & Surfaces
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";

// Navigation
import Drawer from "@mui/material/Drawer";
import MuiLink from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Inputs & Forms
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

// Data Display
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// Feedback & Loading
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";

// Utils & CssBaseline
import CssBaseline from "@mui/material/CssBaseline";
import Slide from "@mui/material/Slide";
// MUI HOOKS & STYLES
import {
  ThemeProvider,
  alpha,
  useColorScheme,
  useTheme,
  styled,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
// MUI ICONS
import Add from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AutoMode from "@mui/icons-material/AutoMode";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BugReport from "@mui/icons-material/BugReport";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DarkMode from "@mui/icons-material/DarkMode";
import FlashOnRounded from "@mui/icons-material/FlashOnRounded";
import ForumRounded from "@mui/icons-material/ForumRounded";
import Home from "@mui/icons-material/Home";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import LightMode from "@mui/icons-material/LightMode";
import Login from "@mui/icons-material/Login";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Newspaper from "@mui/icons-material/Newspaper";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import Person from "@mui/icons-material/Person";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PersonRounded from "@mui/icons-material/PersonRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import Refresh from "@mui/icons-material/Refresh";
import Remove from "@mui/icons-material/Remove";
import StarRounded from "@mui/icons-material/StarRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// LOCAL OVERRIDES
import { ButtonLink, Link } from "./CustomLink";
import CustomMaterialThemeProvider from "./provider";
import { ThemeSwitch } from "./ThemeSwitch";
// EXPORTS
export {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MuiLink,
  Paper,
  Select,
  Skeleton,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,

  // --- Hooks & Utils ---
  alpha,
  ThemeProvider,
  useColorScheme,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
  styled,

  // --- Icons ---
  Add,
  ArrowDropDownIcon,
  AutoMode,
  BookmarkRoundedIcon,
  BugReport,
  ChatBubbleOutline,
  ChatRoundedIcon,
  CheckCircle,
  ContentCopy,
  DarkMode,
  Home,
  FlashOnRounded,
  ForumRounded,
  KeyboardArrowDown,
  KeyboardArrowUp,
  LightMode,
  Login,
  LoginRoundedIcon,
  Logout,
  MenuIcon,
  Newspaper,
  NewspaperIcon,
  Person,
  PersonAdd,
  PersonRounded,
  PeopleAltRoundedIcon,
  Refresh,
  Remove,
  StarRounded,
  TrendingUpRounded,
  Visibility,
  VisibilityOff,

  // --- Local ---
  ButtonLink,
  CustomMaterialThemeProvider,
  Link,
  ThemeSwitch,

  // --- Types ---
  SelectChangeEvent,
};