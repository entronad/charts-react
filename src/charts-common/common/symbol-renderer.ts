/// Strategy for rendering a symbol.
abstract class BaseSymbolRenderer {
  abstract shouldRepaint(oldRenderer: BaseSymbolRenderer): boolean;
}

/// Strategy for rendering a symbol bounded within a box.
abstract class SymbolRenderer extends BaseSymbolRenderer {
  /// Whether the symbol should be rendered as a solid shape, or a hollow shape.
  ///
  /// If this is true, then fillColor and strokeColor will be used to fill in
  /// the shape, and draw a border, respectively. The stroke (border) will only
  /// be visible if a non-zero strokeWidthPx is configured.
  ///
  /// If this is false, then the shape will be filled in with a white color
  /// (overriding fillColor). strokeWidthPx will default to 2 if none was
  /// configured.
  readonly isSolid: boolean;

  abstract paint(): void;
}
