AdDecorator = require '../scripts/ad-decorator'

describe 'AdDecorator', ->
    context '.getName', ->
        it 'returns registerd the ad decorator name', ->
            expect(AdDecorator.getName()).to.equal('article.ad')
