import { enqueueSnackbar, SnackbarProvider } from "notistack";
// Custom
import Header from "./common/header/Header";
import Footer from "./common/Footer";
import { PostCard } from "./common/PostCard";
import { CommentCard } from "./post/CommentCard";
import CommentForm from "./post/CommentForm";
import SortBar from "./common/SortBar";
import LoginContent from "./login/LoginContent";
import LoginForm from "./login/LoginForm";
import SignupContent from "./signup/SignupContent";
import SignupForm from "./signup/SignupForm";
// UX
import ErrorPage from "./common/error";
import NotFound from "./common/not-found";

export {
	enqueueSnackbar,
	SnackbarProvider,
	Header,
	Footer,
	LoginContent,
	LoginForm,
	SignupContent,
	SignupForm,
	PostCard,
	CommentCard,
	CommentForm,
	SortBar,
	ErrorPage,
	NotFound,
};
