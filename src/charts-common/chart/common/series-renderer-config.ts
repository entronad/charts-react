import { SymbolRenderer } from '../../common/symbol-renderer';
import { TypedKey, TypedRegistry } from '../../common/typed-registry';
import { SeriesRenderer } from './series-renderer';

// Interface for series renderer configuration.
export abstract class SeriesRendererConfig<D> {
  // Stores typed renderer attributes
  //
  // This is useful for storing attributes that is used on the native platform.
  // Such as the SymbolRenderer that is associated with each renderer but is
  // a native builder since legend is built natively.
  abstract get rendererAttributes(): RendererAttributes;

  abstract get customRendererId(): string;

  abstract get symbolRenderer(): SymbolRenderer;

  abstract build(): SeriesRenderer<D>;
}

export class RendererAttributeKey<R> extends TypedKey<R> {}

export class RendererAttributes extends TypedRegistry {}
