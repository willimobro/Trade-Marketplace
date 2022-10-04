//
//  QuoteDetailView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct PDFQuote: View {
    @State var timeago = ""
    var body: some View {
        VStack {
            Image("quotepdf")
                        .resizable()
                        .frame(width: 111, height: 164, alignment: .center)
                        .cornerRadius(11)
                        .shadow(color: .gray, radius: 4, x: 0, y: 4)
                        .overlay(
                            VStack{
                                Spacer()
                                RoundedRectangle(cornerRadius: 11)
                                .foregroundColor(Color("Homebackgroundgreen"))
                                .frame(width: 111, height: 48, alignment: .bottom)
                                .overlay(VStack{
                                    Text("$550 NZD")
                                        .foregroundColor(Color( "logogreen"))
                                        .font(.custom("Poppins-SemiBold", size: 14))
                                    Text("Sub Wires")
                                        .foregroundColor(.white)
                                        .font(.caption)
                                })
                                
                                
                            }
                    )
            Text("\(timeago)")
                .font(.caption)
                .frame(width: 100, alignment: .leading)
                .foregroundColor(.gray)
        }
    }
}

struct PDFQuote_Previews: PreviewProvider {
    static var previews: some View {
        PDFQuote()
    }
}
