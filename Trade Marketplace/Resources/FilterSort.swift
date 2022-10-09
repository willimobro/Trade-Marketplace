//
//  FilterSort.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct FilterSort: View {
    var body: some View {
        Capsule()
            .frame(width: 214, height: 54)
            .foregroundColor(.white)
            .shadow(color: .gray, radius: 4, x: 0, y: 0)
            .overlay(
                HStack{
                    HStack{
                        Image(systemName: "slider.horizontal.3")
                            .resizable()
                            .scaledToFit()
                        Text("Nil")
                            .font(.custom("Poppins-SemiBold", size: 19))
                    }
                    .frame(width: 78, height: 19, alignment: .center)
                    Rectangle()
                        .foregroundColor(.black)
                        .frame(width: 1, height: 36)
                    HStack{
                        Image(systemName: "arrow.up.arrow.down")
                            .resizable()
                            .scaledToFit()
                        Text("Nil")
                            .font(.custom("Poppins-SemiBold", size: 19))
                    }
                    .frame(width: 71, height: 19, alignment: .center)
                }
            ).padding(.bottom, 80)
        
    }
}

struct FilterSort_Previews: PreviewProvider {
    static var previews: some View {
        FilterSort()
    }
}
