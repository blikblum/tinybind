import { extend } from "@ribajs/utils";

import { Component } from "@ribajs/core";
import { PopoverOptions } from "@ribajs/bs4";
import { hasChildNodesTrim } from "@ribajs/utils/src/dom";
import { TaggedImageTag as Tag } from "../../interfaces";
import template from "./tagged-image.component.html";
import { debounce } from "@ribajs/utils/src/control";

interface Options {
  popoverOptions: Partial<PopoverOptions>;
  tagOptions: Partial<Tag>;
  multiPopover?: boolean;
}

interface Scope {
  debug: boolean;
  options: Options;
  tags: Tag[];
  fillPopoverOptions: (
    options: Partial<PopoverOptions>
  ) => Partial<PopoverOptions>;
  onPopoverBound: EventListener;
  onPopoverShown: EventListener;
  onPopoverHidden: EventListener;
  onClick: EventListener;
  updateTagPositions: EventListener;
}

export class TaggedImageComponent extends Component {
  /**
   * ATTRIBUTES AND SCOPE
   */
  public static tagName = "tagged-image";

  protected autobind = true;
  public _debug = true;

  static get observedAttributes() {
    return ["tags", "options", "debug"];
  }

  image?: HTMLImageElement;

  protected scope: Scope = {
    debug: false,
    tags: [],
    options: {
      popoverOptions: {}, // set container = this.el in constructor
      multiPopover: false,
      tagOptions: {},
    },
    fillPopoverOptions: (options: Partial<PopoverOptions>) => {
      return { ...this.scope.options.popoverOptions, ...options };
    },
    onClick: this.onClick.bind(this),
    onPopoverBound: this.onPopoverBound.bind(this),
    onPopoverShown: this.onPopoverShown.bind(this),
    onPopoverHidden: this.onPopoverHidden.bind(this),
    updateTagPositions: debounce(this.updateTagPositions.bind(this)),
  };

  /**
   * CONSTRUCTOR AND LIFECYCLE HANDLERS
   */

  constructor(element?: HTMLElement) {
    super(element);
    this.scope.options.popoverOptions.container = this.el;
  }

  protected parsedAttributeChangedCallback(
    attributeName: string,
    oldValue: any,
    newValue: any
  ) {
    if (attributeName === "options") {
      // before the component is bound, we just want to extend the default options
      if (this.bound) {
        this.scope.options = newValue;
      } else {
        this.scope.options = extend(true, oldValue, newValue);
      }
      const po = this.scope.options.popoverOptions;
      if (po && typeof po.container === "string") {
        po.container = document.querySelector(po.container) || undefined;
      }
    }
  }

  protected template() {
    if (hasChildNodesTrim(this.el)) {
      this.parseChildTags();
    }
    return template;
  }

  protected async beforeBind() {
    await super.beforeBind();
    // Template has been loaded. So the <img> tag should be there now.
    this.image = this.el.querySelector("img") as HTMLImageElement;
    this.addEventListeners();
    this.initTags();
  }

  protected addEventListeners() {
    const img = this.image as HTMLImageElement;
    img.addEventListener("load", this.scope.updateTagPositions);
    window.addEventListener("resize", this.scope.updateTagPositions);
    img.addEventListener("click", this.scope.onClick);
  }

  protected async afterBind() {
    await super.afterBind();
    this.passImageAttributes();
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(TaggedImageComponent.observedAttributes);
  }

  disconnectedCallback() {
    this.el.removeEventListener("click", this.scope.onClick);
    window.removeEventListener("resize", this.updateTagPositions);
  }

  /**
   * LIFECYCLE HELPERS
   */

  protected parseChildTags() {
    this.debug(`parseChildTags()`);
    for (const tagEl of Array.from(
      this.el.querySelectorAll("tag") as NodeListOf<HTMLElement>
    )) {
      const title = tagEl.getAttribute("title") || "";
      const content = tagEl.innerHTML;

      const x = ((v) => (isNaN(v) ? Math.random() : v))(
        parseFloat(tagEl.getAttribute("x") || "")
      );
      const y = ((v) => (isNaN(v) ? Math.random() : v))(
        parseFloat(tagEl.getAttribute("y") || "")
      );

      const shape = tagEl.getAttribute("shape") || undefined;
      const color = tagEl.getAttribute("color") || undefined;
      const borderRadius = tagEl.getAttribute("border-radius") || undefined;
      const fullSize = tagEl.getAttribute("full-size") || undefined;
      const smallSize = tagEl.getAttribute("small-size") || undefined;
      const tagData = {
        ...this.scope.options.tagOptions,
        popoverOptions: {
          title,
          content,
          html: true,
          ...this.scope.options.popoverOptions,
        },
        x,
        y,
        shape,
        color,
        borderRadius,
        fullSize,
        smallSize,
      };
      this.scope.tags.push(tagData);
    }
  }

  protected initTags() {
    for (const [index, tag] of this.scope.tags.entries()) {
      tag.index = index;
      const scopeTagOptions = this.scope.options.tagOptions;
      tag.shape = tag.shape || scopeTagOptions.shape;
      tag.borderRadius = tag.borderRadius || scopeTagOptions.borderRadius;
      tag.smallSize = tag.smallSize || scopeTagOptions.smallSize;
      tag.fullSize = tag.fullSize || scopeTagOptions.fullSize;
      tag.color = tag.color || scopeTagOptions.color;
    }
  }

  /**
   * Pass all attributes starting with "img-" down to the <img> Tag, without the prefix.
   */
  protected passImageAttributes() {
    const img = this.image as HTMLImageElement;
    const attrs = this.el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      if (attrs[i].name.startsWith("img-")) {
        img.setAttribute(attrs[i].name.substr(4), attrs[i].value);
      }
    }
  }

  /**
   * EVENT LISTENERS
   */
  onClick(e: Event) {
    if (this.scope.debug) {
      // adapted from here: https://stackoverflow.com/a/42111623/7048200
      // TODO: avoid using "as any"
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = ((e as any).clientX - rect.left) / (rect.right - rect.left); //x position within the element.
      const y = ((e as any).clientY - rect.top) / (rect.bottom - rect.top); //y position within the element.
      console.log("Left: " + x + " ; Top: " + y);
    }
  }
  onPopoverBound(event: Event) {
    /*
     *  We get the anchor `el` for each tag here, after they have been bound in the rv-each,
     *  so we can trigger events on them later.
     */
    const boundIndexAttr = (event.target as HTMLElement).getAttribute("index");
    if (boundIndexAttr === null) {
      throw new Error("popup bound on no index");
    }
    const boundIndex = parseInt(boundIndexAttr);
    if (isNaN(boundIndex)) {
      throw new Error(`boundIndex "${boundIndexAttr}" is not a number!`);
    }
    const foundTag = this.scope.tags.find((tag) => tag.index === boundIndex);
    if (foundTag) {
      foundTag.el = event.target as HTMLElement;
    } else {
      throw new Error(
        `Tag with index (${boundIndex}, "${boundIndexAttr}") not found`
      );
    }
  }
  onPopoverShown(event: Event) {
    for (const tag of this.scope.tags) {
      if (tag.el === event.target) {
        // Set shown popover's anchor as active.
        tag.el.classList.add("active");
      } else {
        // Hide all other popovers and remove active class from other tags if multiPopover option is false.
        if (!this.scope.options.multiPopover) {
          tag.el?.classList.remove("active");
          tag.el?.dispatchEvent(new CustomEvent("trigger-hide"));
        }
      }
    }
  }
  onPopoverHidden(event: Event) {
    const found = this.scope.tags.find((tag) => tag.el === event.target);
    if (found) {
      found.el?.classList.remove("active");
    }
  }

  protected updateTagPositions() {
    /*
     * Currently working for object-fit: cover, contain or fill, and object-position: 50% 50% (default)
     * TODO: make this work for all CSS values of "object-position" and "object-fit"!
     */
    const img = this.image as HTMLImageElement;
    const { width, height, naturalWidth, naturalHeight } = img;
    const wRatio = naturalWidth / width;
    const hRatio = naturalHeight / height;
    const fit = window.getComputedStyle(img).getPropertyValue("object-fit");
    if (
      (fit === "cover" && wRatio > hRatio) ||
      (fit === "contain" && hRatio > wRatio)
    ) {
      for (const tag of this.scope.tags) {
        tag.top = tag.y * 100 + "%";
        tag.left = ((wRatio / hRatio) * (tag.x - 0.5) + 0.5) * 100 + "%";
      }
    } else if (fit === "cover" || fit === "contain") {
      for (const tag of this.scope.tags) {
        tag.left = tag.x * 100 + "%";
        tag.top = ((hRatio / wRatio) * (tag.y - 0.5) + 0.5) * 100 + "%";
      }
    } else {
      for (const tag of this.scope.tags) {
        tag.left = tag.x * 100 + "%";
        tag.top = tag.y * 100 + "%";
      }
    }
  }
}
