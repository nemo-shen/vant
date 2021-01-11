import { isHidden } from '../utils/dom/style';
import { unitToPx } from '../utils/format/unit';
import { createNamespace, isDef, isServer } from '../utils';
import { getScrollTop, getElementTop, getScroller, getVisibleHeight, getVisibleTop } from '../utils/dom/scroll';
import { BindEventMixin } from '../mixins/bind-event';

const [createComponent, bem] = createNamespace('sticky');

export default createComponent({
  mixins: [
    BindEventMixin(function (bind, isBind) {
      if (!this.scroller) {
        this.scroller = getScroller(this.$el);
      }

      if (this.observer) {
        const method = isBind ? 'observe' : 'unobserve';
        this.observer[method](this.$el);
      }

      bind(this.scroller, 'scroll', this.onScroll, true);
      if (this.position === 'top') {
        this.onScroll();
      }
    }),
  ],

  props: {
    zIndex: [Number, String],
    container: null,
    offsetTop: {
      type: [Number, String],
      default: 0,
    },
    offsetBottom: {
      type: [Number, String],
      default: 0,
    },
    position: {
      type: String,
      default: 'top',
      validator:  (val) => ['top', 'bottom'].includes(val)
    }
  },

  data() {
    return {
      fixed: false,
      height: 0,
      transform: 0,
    };
  },

  computed: {
    offsetTopPx() {
      return unitToPx(this.offsetTop);
    },

    offsetBottomPx() {
      return unitToPx(this.offsetBottom);
    },

    style() {
      if (!this.fixed) {
        return;
      }

      const style = {};

      if (isDef(this.zIndex)) {
        style.zIndex = this.zIndex;
      }

      if (this.position === 'top' && this.offsetTopPx && this.fixed) {
        style.top = `${this.offsetTopPx}px`;
      } else if (this.position === 'bottom' && this.offsetBottomPx && this.fixed) {
        style.bottom = `${this.offsetBottomPx}px`;
      }

      if (this.transform) {
        style.transform = `translate3d(0, ${this.transform}px, 0)`;
      }

      return style;
    },
  },

  created() {
    // compatibility: https://caniuse.com/#feat=intersectionobserver
    if (!isServer && window.IntersectionObserver) {
      this.observer = new IntersectionObserver(
        (entries) => {
          // trigger scroll when visibility changed
          if (entries[0].intersectionRatio > 0) {
            this.onScroll();
          }
        },
        { root: document.body }
      );
    }
  },

  methods: {
    onScroll() {
      if (isHidden(this.$el)) {
        return;
      }

      this.height = this.$el.offsetHeight;

      const { container, offsetTopPx, offsetBottomPx, position } = this;
      const scrollTop = getScrollTop(window);
      const topToPageTop = getElementTop(this.$el);
      const windowHeight = getVisibleHeight(window);

      const emitScrollEvent = () => {
        this.$emit('scroll', {
          scrollTop,
          isFixed: this.fixed,
        });
      };

      // The sticky component should be kept inside the container element
      // if (position === 'bottom') {
      //   console.log('\n%c ===============↓↓↓ start component ↓↓↓===============', 'background-color: #36964d; color: #fff;')
      //   console.log(container)
      //   console.log('%c ===============↑↑↑ end component ↑↑↑=================\n', 'border-bottom: 1px solid #36964d; color: #36964d;')
      // }
      if (container) {
        if (position === 'top') {
          const bottomToPageTop = topToPageTop + container.offsetHeight;

          if (scrollTop + offsetTopPx + this.height > bottomToPageTop) {
            const distanceToBottom = this.height + scrollTop - bottomToPageTop;

            if (distanceToBottom < this.height) {
              this.fixed = true;
              this.transform = -(distanceToBottom + offsetTopPx);
            } else {
              this.fixed = false;
            }

            emitScrollEvent();
            return;
          }
        } else {
          const containerTop = getVisibleTop(container);
          const containerHeight = getVisibleHeight(container);
          const distanceToTop = containerTop + this.height + offsetBottomPx - windowHeight;
          const distanceToBottom = windowHeight - containerHeight - containerTop;

          this.fixed = true;
          this.bottom = 0;
          this.transform = 0;

          if (distanceToTop > 0) {
            this.transform = distanceToTop;
          } else if (distanceToBottom > 0) {
            this.transform = -(distanceToBottom);
          }
          // console.log(this.transform)

          emitScrollEvent();
          return;
        }
      }

      if (position === 'top') {
        if (scrollTop + offsetTopPx > topToPageTop) {
          this.fixed = true;
          this.transform = 0;
        } else {
          this.fixed = false;
        }
      } else if (position === 'bottom') {
        if (topToPageTop - scrollTop + this.height + offsetBottomPx > windowHeight) {
          this.fixed = true;
          this.bottom = 0;
          this.transform = 0;
        } else {
          this.fixed = false;
        }
      }

      emitScrollEvent();
    },
  },

  render() {
    const { fixed, position } = this;
    const style = {
      height: fixed ? `${this.height}px` : null,
    };

    return (
      <div style={style}>
        <div class={bem({ [`fixed-${position}`]: fixed })} style={this.style}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
