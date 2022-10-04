//
//  TagSub.swift
//  Trade Marketplace
//
//  Created by William larsen on 21/09/22.
//

import SwiftUI

struct TagSub: View {
    var body: some View {
        VStack{
            Text("Tags")
                .frame(width: 359, height: 14, alignment: .leading)
                .foregroundColor(.gray)
                .font(.custom("Poppins-SemiBold", size: 14))
            ScrollView(.horizontal){
                HStack{
                    beatspill()
                        .padding(.leading, 20)
                    beatspill()
                    beatspill()
                    beatspill()
                    beatspill()
                    beatspill()
                    beatspill()
                    beatspill()
                    beatspill()
                    beatspill()
                }
            }.frame(height: 30, alignment: .leading)
        }
    }
}

struct TagSub_Previews: PreviewProvider {
    static var previews: some View {
        TagSub()
    }
}

struct beatspill: View {
    var body: some View {
        Capsule()
            .foregroundColor(.gray)
            .frame(width:  102, height: 29, alignment: .center)
            .overlay(
                Capsule()
                    .padding(1)
                    .foregroundColor(.white)
                    .opacity(0.80)
                    .overlay(
                        Text("Tags")
                            .foregroundColor(.black)
                            .font(.custom("Poppins-SemiBold", size: 14))
                    )
            )
    }
}
