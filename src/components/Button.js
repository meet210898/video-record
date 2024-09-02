import React from "react";

export function Button(props) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={`
        rounded-lg
        px-2
        disabled:opacity-50
        ${props.inverted ? "text-white" : "text-black"}
        ${
          props.toggled
            ? "bg-red-500"
            : props.inverted
            ? "bg-gray-800"
            : "bg-white"
        }
      ${props.className ? props.className : ""}`}
    >
      {props.children}
    </button>
  );
}
