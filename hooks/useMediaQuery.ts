import * as React from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)
    
    // Update the state with the current value
    setMatches(media.matches)
    
    // Create an event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // Add the listener
    media.addEventListener("change", listener)
    
    // Clean up
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}