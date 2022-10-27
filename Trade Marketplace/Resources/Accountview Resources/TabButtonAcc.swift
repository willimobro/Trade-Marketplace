//
//  TabButtonAcc.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct TabButtonAcc: View {
    @State var headline = ""
    @State var subheadline = ""
    var body: some View {
        RoundedRectangle(cornerRadius: 16.5)
            .foregroundColor(.white)
            .frame(height: 87)
            .padding(.horizontal, 5.0)
            .shadow(color: .gray, radius: 4, x: 0, y: 4)
            .overlay(
                VStack{
                    HStack {
                        Text("\(headline)")
                            .frame(width: 300, height: 24, alignment: .leading)
                        .font(.custom("Poppins-SemiBold", size: 24))
                        Image(systemName: "arrow.right")
                            .resizable()
                            .frame(width: 17, height: 17)
                    }
                    Text("\(subheadline)")
                        .frame(width: 321, height: 24, alignment: .leading)
                        .font(.custom("Poppins-SemiBold", size: 16))
                        .foregroundColor(.gray)
                }
                    .frame(height: 87, alignment: .leading)
                    .padding(20)
            )
    }
}

struct TabButtonAcc_Previews: PreviewProvider {
    static var previews: some View {
        TabButtonAcc()
    }
}
