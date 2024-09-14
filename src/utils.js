function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function lerp(start, end, t, threshold = 0.1) {
  if (Math.abs(end - start) < threshold) {
    return end;
  }

  return start + (end - start) * clamp(t, 0, 1);
}

function getNumericCssValue(elem, prop) {
  const value = getComputedStyle(elem).getPropertyValue(prop);

  if (!value) {
    throw new Error(`Property "${prop}" has not been set.`);
  }

  const numericValue = parseFloat(value);
  const unit = value.match(/[a-zA-Z%]+/);

  if (!unit) {
    throw new Error(`No unit in property "${prop}".`);
  }

  if (unit[0] === 'rem') {
    const remSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    return numericValue * remSize;
  }

  if (unit[0] === 'px') {
    return numericValue;
  }

  throw new Error(`Unsupported unit "${unit[0]}" in property "${prop}".`);
}

export { clamp, lerp, getNumericCssValue };
