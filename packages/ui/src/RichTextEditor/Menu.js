// @flow
import React from "react";
import styled from "@emotion/styled";
import { css } from "emotion";
import type { FormComponentProps } from "./../types";
import classNames from "classnames";

const MenuContainer = styled("div")({
    position: "relative",
    padding: "10px 0 20px 1px",
    borderBottom: "2px solid var(--mdc-theme-on-background)",
    display: "flex",
    alignItems: "center",
    "& > *": {
        display: "inline-block"
    },
    "& > * + *": {
        marginLeft: 10
    },
    span: {
        display: "flex",
        alignContent: "center",
        ">svg": {
            height: 18
        }
    }
});

const MenuButton = ({
    className,
    onClick,
    active,
    children,
    onMouseDown = e => e.preventDefault()
}) => {
    const buttonStyle = css({
        cursor: "pointer",
        color: active
            ? "var(--mdc-theme-primary)"
            : "var(--mdc-theme-text-secondary-on-background)",
        "&:hover": {
            color: "var(--mdc-theme-primary)"
        }
    });

    return (
        <span
            onClick={onClick}
            className={classNames(className, buttonStyle)}
            onMouseDown={onMouseDown}
        >
            {children}
        </span>
    );
};

type Props = FormComponentProps & {
    editor: any,
    activePlugin: ?Object,
    activatePlugin: Function,
    deactivatePlugin: Function,
    plugins: Array<Object>
};

class Menu extends React.Component<Props> {
    menu = React.createRef();

    render() {
        const {
            value,
            onChange,
            editor,
            activePlugin,
            activatePlugin,
            deactivatePlugin,
            plugins
        } = this.props;

        if (!editor) {
            return null;
        }

        const menuItems = plugins;

        return (
            <MenuContainer>
                {menuItems.map(item => {
                    if (!item.menu) {
                        return null;
                    }

                    return React.cloneElement(
                        item.menu.render({
                            MenuButton,
                            value,
                            onChange,
                            editor,
                            activatePlugin
                        }),
                        {
                            key: item.name
                        }
                    );
                })}

                {menuItems
                    .filter(pl => pl.menu && typeof pl.menu.renderDialog === "function")
                    .map(pl => {
                        const props = {
                            onChange,
                            editor,
                            open: activePlugin ? activePlugin.plugin === pl.name : false,
                            closeDialog: deactivatePlugin,
                            activePlugin,
                            activatePlugin
                        };
                        return React.cloneElement(pl.menu.renderDialog(props), { key: pl.name });
                    })}
            </MenuContainer>
        );
    }
}

export default Menu;
