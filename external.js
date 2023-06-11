import { h, render } from "//cdn.skypack.dev/preact";
import { useState, useEffect, useRef } from "//cdn.skypack.dev/preact/hooks";
import htm from "//cdn.skypack.dev/htm";
import cx from "//cdn.skypack.dev/classnames";
import { tw, setup } from "//cdn.skypack.dev/twind";
import { z } from "//esm.run/zod";

setup({
  variants: {
    hocus: ["&:hover", "&:focus"],
  },
});

const html = htm.bind((tag, props, ...children) => {
  if (props?.tw) {
    const stringTw = typeof props.tw === "object" ? cx(props.tw) : props.tw;
    props.class = props.class ? `${props.class} ${tw(stringTw)}` : tw(stringTw);
    delete props.tw;
  }
  return h(tag, props, ...children);
});

export { html, render, useState, useEffect, useRef, tw, cx, z };
