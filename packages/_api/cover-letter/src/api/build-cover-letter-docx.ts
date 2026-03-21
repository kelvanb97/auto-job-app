import type { TCoverLetterResponse } from "#schema/cover-letter-schema"
import { Document, Packer, Paragraph, TextRun } from "docx"

export async function buildCoverLetterDocx(
	name: string,
	coverLetter: TCoverLetterResponse,
): Promise<Buffer> {
	const children: Paragraph[] = []

	// Date
	children.push(
		new Paragraph({
			spacing: { after: 200 },
			children: [
				new TextRun({
					text: new Date().toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					}),
					size: 22,
					font: "Calibri",
				}),
			],
		}),
	)

	// Greeting
	children.push(
		new Paragraph({
			spacing: { after: 200 },
			children: [
				new TextRun({
					text: coverLetter.greeting,
					size: 22,
					font: "Calibri",
				}),
			],
		}),
	)

	// Body paragraphs (split on double newline)
	const paragraphs = coverLetter.body.split("\n\n")
	for (const para of paragraphs) {
		children.push(
			new Paragraph({
				spacing: { after: 200 },
				children: [
					new TextRun({
						text: para.trim(),
						size: 22,
						font: "Calibri",
					}),
				],
			}),
		)
	}

	// Sign-off
	children.push(
		new Paragraph({
			spacing: { before: 200, after: 80 },
			children: [
				new TextRun({
					text: coverLetter.signoff,
					size: 22,
					font: "Calibri",
				}),
			],
		}),
	)

	// Name
	children.push(
		new Paragraph({
			children: [
				new TextRun({
					text: name,
					size: 22,
					font: "Calibri",
				}),
			],
		}),
	)

	const doc = new Document({
		sections: [
			{
				properties: {
					page: {
						margin: {
							top: 1440,
							right: 1440,
							bottom: 1440,
							left: 1440,
						},
					},
				},
				children,
			},
		],
	})

	return Buffer.from(await Packer.toBuffer(doc))
}
