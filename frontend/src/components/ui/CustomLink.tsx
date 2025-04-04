import { forwardRef } from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Link as MuiLink, type LinkProps as MuiLinkProps } from "@mui/material";

type MUILinkProps = Omit<MuiLinkProps, "href">;

const MUILinkComponent = forwardRef<HTMLAnchorElement, MUILinkProps>(
	(props, ref) => {
		return <MuiLink ref={ref} {...props} />;
	},
);

export const CustomLink: LinkComponent<typeof MUILinkComponent> =
	createLink(MUILinkComponent);

interface MUIButtonLinkProps extends ButtonProps<"a"> {
	// Add any additional props you want to pass to the Button
}

const MUIButtonLinkComponent = forwardRef<
	HTMLAnchorElement,
	MUIButtonLinkProps
>((props, ref) => <Button ref={ref} component="a" {...props} />);

const CreatedButtonLinkComponent = createLink(MUIButtonLinkComponent);

export const CustomButtonLink: LinkComponent<typeof MUIButtonLinkComponent> = (
	props,
) => {
	return <CreatedButtonLinkComponent preload={"intent"} {...props} />;
};
