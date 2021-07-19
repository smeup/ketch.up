import { Component, Prop, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'kup-image-button',
    styleUrl: 'kup-image-button.scss',
    shadow: true,
})
export class KupImageButton {
    /**
     * urls of the images
     */
    @Prop() images: any = [];

    /**
     * image dimension
     */
    @Prop({ reflect: true }) size = 64;

    /**
     * If enabled, display the image description below the image
     */
    @Prop({ reflect: true }) showDescription = false;

    /**
     * If enabled, can select one or more images
     */
    @Prop({ reflect: true }) allowMultiSelection = false;

    @State() selectedImages: any = [];

    @Event({
        eventName: 'kup-imagebutton-selected',
        composed: true,
        cancelable: true,
        bubbles: true,
    })
    kupImageButtonSelected: EventEmitter<{
        selectedImages: [];
    }>;

    // ---- Listeners ----
    onImageClick(image: any) {
        const imageIndex = this.selectedImages.indexOf(image);

        if (this.allowMultiSelection) {
            if (imageIndex >= 0) {
                this.selectedImages.splice(imageIndex, 1);
            } else {
                this.selectedImages.push(image);
            }

            this.selectedImages = [...this.selectedImages];
        } else {
            // check if array already contains the image
            if (imageIndex >= 0) {
                this.selectedImages = [];
            } else {
                this.selectedImages = [image];
            }
        }

        this.kupImageButtonSelected.emit({
            selectedImages: this.selectedImages,
        });
    }

    render() {
        let imagesJsx = null;
        if (this.images.length > 0) {
            imagesJsx = this.images.map((image) => {
                const divClass = {
                    selected: this.selectedImages.includes(image),
                };

                const divStyle = {
                    width: `${this.size}px`,
                };

                return (
                    <div
                        class={divClass}
                        onClick={() => this.onImageClick(image)}
                        style={divStyle}
                    >
                        <img src={image.src} title={image.description} />
                        {this.showDescription ? image.description : null}
                        <div class="overlay" />
                    </div>
                );
            });
        }

        return <div id="container">{imagesJsx}</div>;
    }
}
