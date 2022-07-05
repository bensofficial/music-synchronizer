/**
This function removes content written inside parentheses (because it is usually unimportant) 
for strings that exceed a length of 50 characters in order to yield better search results

E.g: `Go Like Time Around An Arrow (Part 3 - Onwards To Meridian) (feat. Circle Percussion)`
becomes `Go Like Time Around An Arrow`
*/
export function shortenLongSongTitle(title: string) {
	if (title.length < 50) {
		return title;
	}

	return title.replaceAll(/(\([^()]+\))/gm, "");
}
