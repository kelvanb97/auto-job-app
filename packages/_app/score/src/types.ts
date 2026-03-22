export type TScoreProgressEvent =
	| { type: "score:start"; total: number }
	| {
			type: "score:progress"
			current: number
			total: number
			title: string
	  }
	| { type: "score:error"; title: string; error: string }
	| {
			type: "score:done"
			scored: number
			errors: number
			total: number
	  }

export type TScoreProgressCallback = (event: TScoreProgressEvent) => void
