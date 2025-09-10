const formatProgramParams = (levelSlug) => ({
  level: levelSlug
    ? levelSlug
        .replace(/-/g, " ")
        .split(" ")
        .map((word) =>
          /^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(word)
            ? word.toUpperCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    : null,
});

export default formatProgramParams;