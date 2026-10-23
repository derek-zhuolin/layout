# Preview webfont subsets

XHSCardDemoSans-*.woff2 are demo-character subsets generated from the bundled Source Han Sans SC fonts using fontTools. Internal font names are changed to XHS Card Demo Sans. Copyright and OFL license records remain, and OFL.txt applies.

The unmodified full OTF fonts remain available. CSS unicode-range uses the small subsets for covered characters and loads the full original face for other characters when needed. New projects should regenerate subsets from their actual text or retain the full-font fallback. This is a preview loading optimization, not a different visual font choice.

Regenerate after copy changes: `python3 shengxin-chutu/scripts/subset-fonts.py .` (fontTools + brotli). The subset includes current page and template text; CSS Unicode ranges are derived from the saved font.
