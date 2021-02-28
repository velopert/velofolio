import axios from 'axios'

export default async function getThreeMonthsTreasuryRate() {
  const response = await axios.get<string>(
    'https://fred.stlouisfed.org/graph/fredgraph.csv?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=1168&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=DTB3&scale=left&cosd=1985-01-01&coed=2021-02-25&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=3&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=Monthly&fam=avg&fgst=lin&fgsnd=2020-02-01&line_index=1&transformation=lin&vintage_date=2021-02-27&revision_date=2021-02-27&nd=1954-01-04'
  )
  const lines = response.data.split('\n').slice(1)
  const rawData = lines
    .slice(0, lines.length - 1)
    .map((line) => line.split(','))

  const data: { date: string; value: number }[] = rawData.map(
    ([date, value]) => ({
      date,
      value: parseFloat(value),
    })
  )
  return data
}
