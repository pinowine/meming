# Rewrite Rules

## POS-based Rules

Based on [Penn part-of-speech tags](https://rednoise.org/rita/reference/postags.html).

### Noun case

1. Proper nouns (NNP, NNPS): extract the first syllable slice
   > e.g. "Boris" -> "Bo", "Jackson" -> "Jack"
2. Normal nouns (NN, NNS): extract all the consonant phones
   > e.g. "cat" -> "kt", "dog" -> "dg"

### Pronoun case

1. All "who" cases (WP): replace with "which"

   > e.g. :
   >
   > - "Mary, who is a doctor" -> "Mary, which is a doctor"
   > - "Who is that guy?" -> "Which is that guy?"

2. Personal pronouns (PRP):
   - we / they -> ppl
   - he -> bro
   - she -> sis
   - you -> u
   - I -> me

3. Possessive pronouns (PRP$)
   - your -> ur
   - his -> bro's
   - her -> sis's

### Conjunction case

All Coordinating conjunction (CC): use "and" to normalize

> e.g. :
>
> - "They gamble, but they don't smoke." -> "They gamble, and they don't smoke."
> - "Don't push that button, or you will die!" -> "Don't push that button, and you will die!"
> - "They do not gamble or smoke, for they are ascetics." -> "They do not gamble or smoke, and they are ascetics."

## Lexicon-based rules

1. **Pronoun+(Modal verb / auxiliary verb) -> abbreviation**

   No auxiliary verb case in RiTa.pos(), so I need to manually detect it.

   > e.g. :
   >
   > - "I will" -> "I'll"
   > - "I would" -> "I'd"
   > - "I am" -> "I'm"
   > - "I have" -> "I've"

2. **Normal Abbreviation**
   - for -> 4
   - to -> 2
   - before -> b4
   - because -> cuz
   - sorry -> sry

3. **Slang**
   - smile / laugh / happy / ecstasy -> lmao / lmfao / lol
   - respect -> o7
   - scare / horror / shock / amaze -> omg
   - what -> what the hell
   - good / great / nice / best -> goated
   - done / ended / over / finished / killed / destroyed -> cooked
   - think / consider / understand -> cook

## Grammar-based Rules

1. Break between sentences:
   - lowkey
   - sort of
   - you know
   - I mean
   - kind of
   - fr
   - ngl

   > e.g. :
   >
   > "He is safe but not happy." -> "Bro's safe, ngl, and not happy."

2. Meaningless sentence beginning:
   - tbh
   - I would like to say
   - I'd say
   - I gotta say
   - Honestly
   - Surely
   - What I want to say is
   - What I'm trying to say is

   > e.g. a completely meaningless but extremely long sentence :
   >
   > I don't know.
   >
   > ->
   >
   > What I'm trying to say is, lowkey, tbh, you know, I mean, I would like to say, I don't know.
