interface ISceneSizeUpdater {
    updateCanvasSize(): void;
}

class SceneResizer {
   constructor(
       private readonly scene: ISceneSizeUpdater,
   ) {
       window.addEventListener('resize', this.updateSize);
   }

   public destroy(): void {
       window.removeEventListener('resize', this.updateSize);
   }

   private readonly updateSize = (): void => {
       this.scene.updateCanvasSize();
   }
}

export {
    SceneResizer,
}
