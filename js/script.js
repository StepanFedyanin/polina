class Fancyapps {
    selector = '[data-gallery=""]';

    constructor() {
        Fancybox.bind(this.selector, {
            groupAll: true,
        });
    }
}

new Fancyapps();
