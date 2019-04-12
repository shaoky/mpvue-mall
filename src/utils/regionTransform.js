import { getRegion } from '@/api/getData'

export const  transformRegion = (region,address) => {
    var obj={
        options: [],
        regionNumber: [],
        str: '',
        region_1: '',
        region_2: '',
        region_3: '',
        index1: '',
        index2: '',
        addressInfo: ''
    }

    if(region){
        obj.regionNumber.push(region.slice(0, 2) + '000000', region.slice(0, 4) + '0000', region)
    }
    if(address){
        obj.addressInfo = address
    }

    var  buildModel = (data) => {
        data.forEach((val) => {
            val.value = val.id
            val.label = val.name
            if (typeof val.regions === 'object') {
                val.children = val.regions
                delete val.regions
                buildModel(val.children)
            }
            delete val.id
            delete val.name
        })
        return data
    }
    var getRegion1 = async () => {
        if (wx.getStorageSync('region')) {
            obj.options = JSON.parse(wx.getStorageSync('region'))
        } else {
            let res = await getRegion({ id: '00000000' })
            res = buildModel(res.data.regions)
            wx.setStorageSync('region', JSON.stringify(res))
            obj.options = res
        }
        if (obj.regionNumber.length > 0) {
            obj.options.forEach(
                (item1, index1) => {
                    if (item1.value == obj.regionNumber[0]) {
                        obj.region_1 = obj.options[index1].label
                        obj.index1 = index1
                    }
                }
            )
            if (obj.index1 != null) {
                obj.options[obj.index1].children.forEach(
                    (item1, index1) => {
                        if (item1.value == obj.regionNumber[1]) {
                            obj.region_2 = obj.options[obj.index1].children[index1].label
                            obj.index2 = index1
                        }
                    }
                )
            }
            if (obj.index2 != null) {
                obj.options[obj.index1].children[obj.index2].children.forEach(
                    (item1, index1) => {
                        if (item1.value == obj.regionNumber[2]) { obj.region_3 = item1.label }
                    }
                )
            }
            obj.str = obj.region_1 + obj.region_2 + obj.region_3 + obj.addressInfo
        }
    }
    getRegion1()
    return obj.str
}